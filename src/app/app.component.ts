import { Component } from '@angular/core';
import * as crypto from 'crypto-js';
import * as AsymmetricCrypto from 'asymmetric-crypto';

interface RSA {
  publicKey: string;
  secretKey: string;
};

interface Encriptado {
  data: string;
  nonce: string;
};

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  chaveSecreta: any;
  chaveSecretaGerada = false;
  senha = '';
  texto = '';

  textoCriptografado = '';
  textoDecriptografado = '';

  objetoChaveSecreta: Encriptado;
  chaveRSA: RSA;

  public gerarChaveSecreta() {
    var salt = crypto.lib.WordArray.random(128 / 8);

    this.chaveSecreta = crypto.PBKDF2(this.senha, salt, {
      keySize: 256 / 32
    });

    this.chaveSecretaGerada = true;

    console.log('chave secreta: ', this.chaveSecreta.toString())
  }

  public criptografarTexto(): void {
    const chave = this.chaveSecreta.toString();

    const criptografado = crypto.AES.encrypt(this.texto, chave);
    this.textoCriptografado = criptografado.toString();

    console.log('texto criptografado:', this.textoCriptografado)
  }

  public decriptografarTexto() {
    const chave = this.chaveSecreta.toString();

    const decriptografado = crypto.AES.decrypt(this.textoCriptografado, chave);
    this.textoDecriptografado = decriptografado.toString(crypto.enc.Utf8);

    console.log('chave decriptografado:', this.textoDecriptografado)
  }

  public gerarChavesRSA() {
    this.chaveRSA = AsymmetricCrypto.keyPair();
    this.criptografarChave();
  }

  private criptografarChave() {
    this.objetoChaveSecreta = AsymmetricCrypto.encrypt(
      this.chaveSecreta.toString(),
      this.chaveRSA.publicKey,
      this.chaveRSA.secretKey
    );

    console.log('chave criptografada:', this.objetoChaveSecreta.data)
  }

  public decriptografarChave() {
    const chaveDecriptada = AsymmetricCrypto.decrypt(
      this.objetoChaveSecreta.data,
      this.objetoChaveSecreta.nonce,
      this.chaveRSA.publicKey,
      this.chaveRSA.secretKey
    );

    console.log('senha decriptografado:', chaveDecriptada)
  }

}
