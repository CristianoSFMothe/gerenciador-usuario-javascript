class UserController {

  constructor(formId, tableId){

    this.formEl = document.getElementById(formId);
    this.tableEl = document.getElementById(tableId);

    this.onSubmit();

  }

  // Método do evento do clique no botão
  onSubmit() {

    this.formEl.addEventListener('submit', event =>{

      event.preventDefault();  

      this.addLine(this.getValues());
      
    });
  }
  // Fechando o método onSubmit

  // Método para receber os atributos dos componentes
  getValues() {    

    let user = {};

    [...this.formEl.elements].forEach(function (field, index) {

      if (field.name == 'gender') {
  
        if (field.checked) {
          user[field.name] = field.value;
        }
  
      } else {
  
        user[field.name] = field.value;
      }
  
    });
  
    return new User(
        user.name, 
        user.gender, 
        user.birth, 
        user.country, 
        user.email, 
        user.password, 
        user.photo, 
        user.admin
      );
  }
  // Fechando o método getValues

  addLine(dataUser) {

    console.log(dataUser);
  
    this.tableEl.innerHTML = `
      <tr>
        <td>
          <img src="dist/img/user2-160x160.jpg" alt="User Image" class="img-circle img-sm">
        </td>
            <td>${dataUser.name}</td>
            <td>${dataUser.email}</td>
            <td>${dataUser.admin}</td>
            <td>${dataUser.birth}</td>
            <td>
              <button type="button" class="btn btn-primary btn-xs btn-flat">Editar</button>
              <button type="button" class="btn btn-danger btn-xs btn-flat">Excluir</button>
            </td>
      </tr>
    `;
  }

}