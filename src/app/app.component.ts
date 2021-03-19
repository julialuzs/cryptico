import { Component, Input } from '@angular/core';
import * as crypto from 'crypto-js';
import * as AsymmetricCrypto from 'asymmetric-crypto';

interface RSA {
  publicKey: string;
  secretKey: string;
};

interface ChaveSecreta {
  data: string;
  nonce: string;
};

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  chaveSecreta: any = '';
  senha = '';
  texto = '';

  textoCriptografado = '';
  textoDecriptografado = '';

  chaveCriptografada = "";
  chaveDecriptada = "";

  objetoChaveSecreta: ChaveSecreta;
  chaveRSA: RSA;

  @Input() julia;

  get chaveSecretaGerada(): boolean {
    return this.chaveSecreta?.toString().length > 0;
  }

  public gerarChaveSecreta() {
    // The US National Institute of Standards and Technology recommends a salt length of 128 bits
    var salt = crypto.lib.WordArray.random(128 / 8);

    this.chaveSecreta = crypto.PBKDF2(this.senha, salt, {
      keySize: 256 / 32
    });

    this.gerarChavesRSA();

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

    console.log('chave pública:', this.chaveRSA.publicKey)
    console.log('chave privada:', this.chaveRSA.secretKey)
  }

  public criptografarChave() {
    this.objetoChaveSecreta = AsymmetricCrypto.encrypt(
      this.chaveSecreta.toString(),
      this.chaveRSA.publicKey,
      this.chaveRSA.secretKey
    );

    this.chaveCriptografada = this.objetoChaveSecreta.data

    console.log('chave criptografada:', this.chaveCriptografada)
  }

  public decriptografarChave() {
    this.chaveDecriptada = AsymmetricCrypto.decrypt(
      this.objetoChaveSecreta.data,
      this.objetoChaveSecreta.nonce,
      this.chaveRSA.publicKey,
      this.chaveRSA.secretKey
    );

    console.log('chave decriptografado:', this.chaveDecriptada)
  }

}
