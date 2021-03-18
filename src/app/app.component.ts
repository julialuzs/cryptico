import { Component } from '@angular/core';
import * as crypto from 'crypto-js';
import { Cryptico } from 'cryptico';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'cripto';

  senhaSecreta: any;
  senha = '';
  text = '';

  textoCriptografado = '';
  textoDecriptografado = '';

  senhaGerada = false;

  chaveRSA;
  chavePublica;

  // simetrica
  public gerarSenha() {
    var salt = crypto.lib.WordArray.random(128 / 8);

    this.senhaSecreta = crypto.PBKDF2(this.senha, salt, {
      keySize: 256 / 32
    });

    this.senhaGerada = true;

    console.log(this.senhaSecreta.toString())
  }

  criptografar() {
    const senha = this.senhaSecreta.toString();
    const socorro = crypto.AES.encrypt(this.text, senha);
    this.textoCriptografado = socorro.toString();
    console.log(this.textoCriptografado);
  }

  decriptografar() {
    const senha = this.senhaSecreta.toString();
    const decriptografado = crypto.AES.decrypt(this.textoCriptografado, senha);

    this.textoDecriptografado = decriptografado.toString(crypto.enc.Utf8);
    console.log(this.textoDecriptografado);
  }

  // assimetrica
  gerarChavesRSA() {
    const bits = 1024;

    this.chaveRSA = Cryptico.generateRSAKey(this.senha, bits);
    this.chavePublica = Cryptico.publicKeyString(this.chaveRSA);
  }

}
