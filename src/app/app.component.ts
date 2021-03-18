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

  senhaSecreta: any;
  senha = '';
  text = '';

  textoCriptografado = '';
  textoDecriptografado = '';

  senhaGerada = false;

  objetoSenhaSecreta: Encriptado;
  chaveRSA: RSA;

  // simetrica
  // public gerarSenha() {
  //   var salt = crypto.lib.WordArray.random(128 / 8);

  //   this.senhaSecreta = crypto.PBKDF2(this.senha, salt, {
  //     keySize: 256 / 32
  //   });

  //   this.senhaGerada = true;

  //   console.log(this.senhaSecreta.toString())
  // }

  public criptografar(): void {
    const senha = this.senhaSecreta.toString();
    const criptografado = crypto.AES.encrypt(this.text, senha);

    this.textoCriptografado = criptografado.toString();
  }

  public decriptografar() {
    const senha = this.senhaSecreta.toString();
    const decriptografado = crypto.AES.decrypt(this.textoCriptografado, senha);

    this.textoDecriptografado = decriptografado.toString(crypto.enc.Utf8);
  }

  // assimetrica
  public gerarChavesRSA() {
    this.chaveRSA = AsymmetricCrypto.keyPair();
    this.criptografarSenha();
  }

  private criptografarSenha() {
    this.objetoSenhaSecreta = AsymmetricCrypto.encrypt(
      this.senha,
      this.chaveRSA.publicKey,
      this.chaveRSA.secretKey
    );

    this.senhaSecreta = this.objetoSenhaSecreta.data;
    console.log('senha decriptografado:', this.senhaSecreta)
    this.senhaGerada = true;
    this.decriptografarSenha();
  }

  private decriptografarSenha() {
    const chaveDecriptada = AsymmetricCrypto.decrypt(
      this.objetoSenhaSecreta.data,
      this.objetoSenhaSecreta.nonce,
      this.chaveRSA.publicKey,
      this.chaveRSA.secretKey
    );

    console.log('senha decriptografado:', chaveDecriptada)
  }

}
