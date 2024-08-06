import { Injectable } from '@nestjs/common';
import Afip from '@afipsdk/afip.js';
import { HttpService } from '@nestjs/axios';
import QRCode from 'qrcode';
import { AxiosResponse } from 'axios';
import { firstValueFrom, lastValueFrom, map, Observable } from 'rxjs';
import { join } from 'path';
import { readFileSync } from 'fs';
import Handlebars from 'handlebars';

@Injectable()
export default class DocumentGeneratorService {
  constructor(private readonly httpService: HttpService) {}

  public async getDatosCmpBase64ByAfipService(
    datosCmpBase64: string,
  ): Promise<any> {
    const observable = this.httpService
      .get('https://www.afip.gob.ar/fe/qr/', {
        params: {
          p: datosCmpBase64,
        },
      })
      .pipe(map((response) => response));

    const respuestaAfip = await lastValueFrom(observable);
    const responseUrl = respuestaAfip.request?.res?.responseUrl;
    return responseUrl;
  }

  public async crearQr(
    puntoDeVenta: number,
    importeTotal: number,
    nroCmp: number,
    caeNumero: number,
  ) {
    const fecha = new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
      .toISOString()
      .split('T')[0];

    const data = {
      ver: 1,
      fecha: fecha,
      cuit: 20359999470,
      ptoVta: puntoDeVenta,
      tipoCmp: 6,
      nroCmp: nroCmp,
      importe: importeTotal,
      moneda: 'PES',
      ctz: 1,
      tipoDocRec: 99,
      nroDocRec: 0,
      tipoCodAut: 'E',
      codAut: caeNumero, //codigo autorizacion otorgado por afip
    };

    const jsonString = JSON.stringify(data);

    // Paso 2: Codificar la cadena en Base64
    const dataAsBase64 = Buffer.from(jsonString).toString('base64');

    const responseAfip = await this.getDatosCmpBase64ByAfipService(
      dataAsBase64,
    );

    QRCode.toDataURL(responseAfip)
      .then((url) => {
        console.log('url con exito.');
      })
      .catch((err) => {
        console.error(err);
      });
  }

  public async crearPdf(data, caeFchaVto, cae) {
    // const html = require('fs').readFileSync('./bill.html', 'utf8');
    const filePath = join(
      process.cwd(),
      'src',
      'Stock',
      'application',
      'html',
      'bill.html',
    );
    let html = null;
    let htmlData = null;

    console.log('data', data);
    const dataForHtml = {
      tipoFactura: 'B',
      empresa: 'Kiosking',
      domicilio: data?.ver,
      condicionIva: 1,
      puntoVenta: data?.ptoVta,
      comprobanteNumero: 1,
      fechaEmision: data?.fecha,
      cuit: data?.cuit,
      ingresosBrutos: 1,
      inicioActividades: 1,
      periodoDesde: data?.FchServDesde,
      periodoHasta: data?.FchServHasta,
      fechaVtoPago: 1,
      clienteCuit: null,
      clienteNombre: null,
      clienteCondicionIva: null,
      clienteDomicilio: null,
      condicionVenta: 2,
      subtotal: 2,
      otrosTributos: null,
      importeTotal: data?.importe,
      cae: cae,
      fechaVtoCae: caeFchaVto,
    };

    try {
      html = readFileSync(filePath, 'utf8');
      const template = Handlebars.compile(html);
      console.log('temp', template);
      htmlData = template(dataForHtml);
      console.log('result>>>>>>>>>>.', dataForHtml);
    } catch (error) {
      console.log(error);
    }
    let afip = new Afip({
      CUIT: 20359999470,
      cert: '-----BEGIN CERTIFICATE-----MIIDRTCCAi2gAwIBAgIIA4meLrHTkH0wDQYJKoZIhvcNAQENBQAwODEaMBgGA1UEAwwRQ29tcHV0YWRvcmVzIFRlc3QxDTALBgNVBAoMBEFGSVAxCzAJBgNVBAYTAkFSMB4XDTI0MDgwMTIwMzM1OFoXDTI2MDgwMTIwMzM1OFowKzEOMAwGA1UEAwwFdGVzdDExGTAXBgNVBAUTEENVSVQgMjAzNTk5OTk0NzAwggEiMA0GCSqGSIb3DQEBAQUAA4IBDwAwggEKAoIBAQCtC1bCIi415e/VIDzo7kfFy362e/A0IyX+DkoXCk8Un/N2iPCIuEEwnDSpwtMirDJ8ri6fi2QlcGCWVZNXtmiDfusWlKrLSQGPPYSV3WYCsS0qsJ6TsVPQhpODCPevSnKCBNaIBWiB8l3Osz0rTlwZBv1R4JnR9QouBfPeE/osBxj2FZlZ7Cjq9Iub0BUOMFxAFMvUXZikGpNP2WGXeTF9klxLMzKCWIObjWZ6+ISKBql7+gf1EMS4psmeOVxT4vFRZusrXflCoz6hPHA4eBMtntXzNKz+7tnM9JbwpTHwGRTnG1E65M9fk9OKjsQ8LtMsSAjUv5FN1KVYRhu15ERzAgMBAAGjYDBeMAwGA1UdEwEB/wQCMAAwHwYDVR0jBBgwFoAUs7LT//3put7eja8RIZzWIH3yT28wHQYDVR0OBBYEFKR4wF7Bz9p7hpLzcICPfjko5QXPMA4GA1UdDwEB/wQEAwIF4DANBgkqhkiG9w0BAQ0FAAOCAQEAkI87CfEF5rHFqvCS8zO9dqU2MYvA7qhmUYct5pQSR/wec9eeEqW0aXAHqRdITY1F9DTs042OZuBQmkuaV2wvb/kQY87sJHnRMx60YRZp46u9RKjj8U4ynjRfc4cB6E6poSU5dY8bu1jYv7aHylSp799H85RAUFx9oTVnecFkQVplxMbnbQ15h2/LOy8XL1W0PNfLF/yfPTuGjtvjwGT2jOWSrckl6jX8IK328ojQEgb+GGSAhKcpKpGKAVafmxzdyiDpRyzqo24SdpU4b+j/VxSfssvSin6xCiOm8HBItE92YRnslskZXaBaz05D2ptEH51B1a1g2yocOyFyDKXsVA==-----END CERTIFICATE-----',
      key: '-----BEGIN RSA PRIVATE KEY-----MIIEpAIBAAKCAQEArQtWwiIuNeXv1SA86O5Hxct+tnvwNCMl/g5KFwpPFJ/zdojwiLhBMJw0qcLTIqwyfK4un4tkJXBgllWTV7Zog37rFpSqy0kBjz2Eld1mArEtKrCek7FT0IaTgwj3r0pyggTWiAVogfJdzrM9K05cGQb9UeCZ0fUKLgXz3hP6LAcY9hWZWewo6vSLm9AVDjBcQBTL1F2YpBqTT9lhl3kxfZJcSzMygliDm41meviEigape/oH9RDEuKbJnjlcU+LxUWbrK135QqM+oTxwOHgTLZ7V8zSs/u7ZzPSW8KUx8BkU5xtROuTPX5PTio7EPC7TLEgI1L+RTdSlWEYbteREcwIDAQABAoIBAFJSlKGitS07CI/x2EhQI6D7oHqcF7gWCJsGnUS8yMZdGewIVbYVQh4oEf25C8zw8svR6ahJHgmZnrmmWIRf6PS1yo1hiKdRQgatE4hgXYlmVMB8adSFhgQsIb0y5PJljnhAaPco64D2lp4hMzaI/tOBOb5cBZGW65LdjhjWlCuhJH+91l1u5N2xkxvqRIRbiy9p/zz33BhK27Rh663caHOmIPRl9Q0WVck3RdlSiEqcOonwkF7OD5U2dr1+i7xlGUUxpycdQ+w0lux7lsPyDev+AZjt5N5fHSyxwe5canj1H5h3FRxypBc8OIsjTcPV1alndW57o1K5Jd8IfJpqWvECgYEA1HPDDllB1RjY2WVDF3/ZG9eYtWAXr3BINDxEO5tKaaIJFIA9ZWQNLa8OCAxUhthtj7XSdJZT5VQGeqNqLPj5xmAF7TWrD3kJfYK8oza8iZDdCrm10hyjbxhuh8/Ttl2xgqaPgUQpGnFUYlo/Bq6ybj+IXL2ZCrWsa1FChucYBmUCgYEA0IOuxGLwj6g2ZDaruoRW5OGipA0/+VPR8cdr1J3fFTyeDJJDtgEVukPR9kN7GpIDvBHVcpB+DlDz1JJbGvfIITgAaZDVILkPQn97fPAOUjRllq73EIP3vCBPFw8Ypembm4iqT6nyXuGZtvyd5qWttpBiE8t4SqsJ0zE/fbpLpfcCgYA9LXil0R4b9yO6tmYzhiVG1zaqRBmN849XO2OKppUvBfIHbUZAxCbnWNl5h9NvYTNrhrgryn4uM5wKBLS2bpu+fDg4rpOryPbqpZMcjM6N7qE4TXIGJykI/MgXY8lbYm+TZ9M7Lh2H98qM59/uVLAc/z6NNiuz4czcunGl1zYb4QKBgQCIlLj1iplogBagre7uzaDda67NJqCxAGaUqLvJGV/22S3triEMJsnEqIfvd2Q7k0k+96+Iy3zGg+AzbWqfz44XtEcQ3v274XxNYpPQ0q2OyyOAADt1ZfvwDnm/8POEOfDjgDGO3RMVc1Dsu6vyWLPg0dJshOrWfhKBc9DS2iSTIQKBgQCDd/TdlVwBAvpB9HQxRVng6PS/oui5g80/Zj0n4dNLlyIlTEuwLYZXeruUa45iWE8QrTef29Lc4MzGl9riZvit01MtLYB3iVUuUCqeW+Yhm7+JNHVFU0IN0H5moVCubP4Y0cg5D7nZ81hMU/0EgKDb2scycltYRZABLEfXlcE+Gw==-----END RSA PRIVATE KEY-----',
    });

    // Nombre para el archivo (sin .pdf)
    const name = 'El nombre que quieras br1';

    // Opciones para el archivo
    const options = {
      width: 8, // Ancho de pagina en pulgadas. Usar 3.1 para ticket
      marginLeft: 0.4, // Margen izquierdo en pulgadas. Usar 0.1 para ticket
      marginRight: 0.4, // Margen derecho en pulgadas. Usar 0.1 para ticket
      marginTop: 0.4, // Margen superior en pulgadas. Usar 0.1 para ticket
      marginBottom: 0.4, // Margen inferior en pulgadas. Usar 0.1 para ticket
    };

    // Creamos el PDF
    const res = await afip.ElectronicBilling.createPDF({
      html: htmlData ?? html,
      file_name: name,
      options: options,
    });

    // Mostramos la url del archivo creado
    console.log(res.file);
    return res;
  }
}
