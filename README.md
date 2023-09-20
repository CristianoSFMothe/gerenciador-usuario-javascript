<p align="center">
 <img alt="GitHub language count" src="https://img.shields.io/github/languages/count/CristianoDaSilvaFerreira/gerenciador-usuario-javascript?style=for-the-badge"> <img alt="GitHub top language" src="https://img.shields.io/github/languages/top/CristianoDaSilvaFerreira/gerenciador-usuario-javascript?style=for-the-badge">
 <img alt="GitHub repo size" src="https://img.shields.io/github/repo-size/CristianoDaSilvaFerreira/gerenciador-usuario-javascript?style=for-the-badge"> 
 <img alt="GitHub" src="https://img.shields.io/github/license/CristianoDaSilvaFerreira/gerenciador-usuario-javascript?style=for-the-badge">
<img alt="GitHub release (latest by date)" src="https://img.shields.io/github/v/release/CristianoDaSilvaFerreira/gerenciador-usuario-javascript?style=for-the-badge">
</p>

<p align="center">
 <img src="https://img.shields.io/static/v1?label=Deveoper&message=CristianoFerreira&color=7159c1&style=for-the-badge&logo=ghost"/>
</p>

<h1 align="center">:key: Gerenciador Usuário JavaScript</h1>

 <p>Projeto de um site de Gerenciamento de Usuários, criado durante o curso de JavaScript completo da Hcode Treinamento - Udemy. Usando o templete visual do <a href="https://cristianosfmothe.github.io/gerenciador-usuario-javascript/" target="_blank">AdimLTE</a></p>
 
<h2>Description</h2>
<p>Com a utilização do JavaScrip, criando um sistema de Gerenciamento de Usuários, baseado no tamplete do AdminLTE, no qual poderá fazer o CRUD completo, usando funcionalidade atuais do ES6. É com isso na primeira parte do projeto, será permitido realizar o salvamento das informações no broswer do usuário, atráves do localStorage</p>

~~~javascript
 save() {

     let users = User.getUsersStorage();

     if (this.id > 0) {

       users.map(u => {

         if (u._id == this.id) {

           Object.assign(u, this); 
         }

         return u;

       });      

     } else {

       this._id = this.getNewID();

       users.push(this);
     }

     localStorage.setItem('users', JSON.stringify(users));
   }
 ~~~
 
 
<h3>:eyes:  Preview</h3>

![image](https://user-images.githubusercontent.com/68359459/128443907-fb29dc1c-eb49-4927-a6f7-bc12f948868e.png)

Podendo ser acessado atráves da página do projeto <a href="https://cristianodasilvaferreira.github.io/gerenciador-usuario-javascript/" target="_blank">Gerenciador Usuários JavaScript</a> hospetada no repositório do GitPage



<h3>🛠 Tecnologias</h3>

  As seguintes ferramentas foram utilizadas para construção desse projeto:
  - [JavaScript](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript)
  - [HTML5](https://www.w3schools.com/html/)
  - [CSS3](https://www.w3schools.com/css/)

 
<h3> Autor </h3>

<a>
 <img style="border-radius: 50%;" src="https://user-images.githubusercontent.com/68359459/128278200-0cba229d-615d-410c-8800-ef09d0367c35.jpg" width="100px;" alt=""/>
 <sub><b>Cristiano da Silva Ferreira</b></sub></a>🚀


Feito com ❤️ por Cristiano da Silva Ferreira - atráves da formação do curso da <a href="https://hcode.com.br/cursos/JSFULL" target="_blank">Hcode Treinamentos</a> - <a href="https://www.udemy.com/course/javascript-curso-completo/" target="blank">Udemy</a> 👋🏽 Entre em contato!

[![Linkedin Badge](https://img.shields.io/badge/-Cristiano-blue?style=flat-square&logo=Linkedin&logoColor=white&link=https://www.linkedin.com/in/cristiano-da-silva-ferreira/)](https://www.linkedin.com/in/cristiano-da-silva-ferreira/) 
[![Gmail Badge](https://img.shields.io/badge/-cristianodevsystemo@gmail.com-c14438?style=flat-square&logo=Gmail&logoColor=white&link=mailto:cristianodevsysten@gmail.com)](mailto:cristianodevsystem@gmail.com)


<p align="center">
 <a href="#objetivo">Objetivo</a> •
 <a href="#tecnologias">Tecnologias</a> • 
 <a href="#contribuicao">Contribuição</a> • 
 <a href="#licenc-a">Licença</a> • 
 <a href="#autor">Autor</a>
</p>

<h4 align="center">
    <a href="https://developer.mozilla.org/pt-BR/docs/Web/JavaScript">🔗 JavaScript - Aplimoramento</a>
</h4>



<h4 align="center"> 
	🚧  Construindo mais funcionalidades...  🚧
</h4>
