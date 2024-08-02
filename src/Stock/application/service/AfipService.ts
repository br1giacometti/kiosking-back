import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import Afip from '@afipsdk/afip.js';
import { firstValueFrom } from 'rxjs';
import { ConfigService } from '@nestjs/config';

@Injectable()
export default class AfipService {
  constructor(
    private readonly configService: ConfigService,
  ) {}

  public async generarFacturaB(
    puntoDeVenta: number,
    importeTotal: number,
  ) {
    const tipo_de_factura = 6; // 6 = Factura B
    const cuit = this.configService.get<string>('CUIT_AFIP');

    console.log('OBTENIENDO CERT DE AFIP...', cuit);

    let afip = new Afip({
      CUIT: this.configService.get<string>('CUIT_AFIP'),
      cert: this.configService.get<string>('CERT_AFIP'),
      key: this.configService.get<string>('KEY_AFIP'),
    });

    console.log('INSTANCIA AFIP...', afip);

    const last_voucher = await afip.ElectronicBilling.getLastVoucher(
      puntoDeVenta,
      tipo_de_factura,
    );

    console.log('Last voucher: ', last_voucher);

    const numero_de_factura = last_voucher + 1;

    const fecha = new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
      .toISOString()
      .split('T')[0];

    const data = {
      CantReg: 1, // Cantidad de facturas a registrar
      PtoVta: 1,
      CbteTipo: tipo_de_factura,
      Concepto: 1,
      DocTipo: 99,
      DocNro: 35999947,
      CbteDesde: numero_de_factura,
      CbteHasta: numero_de_factura,
      CbteFch: parseInt(fecha.replace(/-/g, '')),
      FchServDesde: fecha,
      FchServHasta: fecha,
      FchVtoPago: null,
      ImpTotal: importeTotal,
      ImpTotConc: 0, // Importe neto no gravado
      ImpNeto: this.calcularPrecioNeto(importeTotal),
      ImpOpEx: 0,
      ImpIVA: this.calcularIvaAgregado(importeTotal),
      ImpTrib: 0, //Importe total de tributos
      MonId: 'PES', //Tipo de moneda usada en la factura ('PES' = pesos argentinos)
      MonCotiz: 1, // Cotización de la moneda usada (1 para pesos argentinos)
      Iva: [
        // Alícuotas asociadas a la factura
        {
          Id: 5, // Id del tipo de IVA (5 = 21%)
          BaseImp: this.calcularPrecioNeto(importeTotal),
          Importe: this.calcularIvaAgregado(importeTotal),
        },
      ],
    };


    try {
      //generamos la factura
        const res = await afip.ElectronicBilling.createVoucher(data);

    //const response = await firstValueFrom(this.httpService.post(url, data));
      console.log('resp>', res.data);
      return res.data;
    } catch (error) {
      throw new Error(`Error al autenticar con AFIP: ${error.message}`);
    }
  }
  public calcularPrecioNeto(precioConIva) {
    const IVA = 0.21;
    const precioNeto = precioConIva / (1 + IVA);
    return precioNeto;
  }

  public calcularIvaAgregado(precioConIva) {
    const IVA = 0.21;
    const precioNeto = precioConIva / (1 + IVA);
    const ivaAgregado = precioConIva - precioNeto;
    return ivaAgregado;
  }
}
