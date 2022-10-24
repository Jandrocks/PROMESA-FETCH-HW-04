import { data } from "../data.js";
let btnPromesas = document.querySelector('#btn-primario')
let btnFetch = document.querySelector('#btn-secundario')
let contenedorPromesa = document.querySelector('.contendor_promesa')
let contenedorFetch = document.getElementById("contendor_fetch_id")
let btnBuscarFetch = document.getElementById("btn-buscar") 
let inputBuscarFetch = document.querySelector('.input_buscar')
let contendorBuscador = document.querySelector('.contendorBuscador')
let isOk = true;

let getProductjsonArray 

//pagination

let pageNumber=1;
let pageSize=10;  
let pagination;
let pageCont;


function paginate(array, page_size, page_number) {
    return array.slice((page_number - 1) * page_size, page_number * page_size);
}


//-------PROMESAS------------//

const customPromise = (time, task) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if(isOk){          
          resolve(task)          
        }else{
          reject("error")
        }
      }, time);
    })
}

const mostrarProductosPromesa = () =>{
  
  customPromise(4000, data).then(    
    producto => {      
      let agregadosHtml = ""
      producto.forEach(productos => {
        agregadosHtml += `
        <div class="card" style="width: 18rem;">
          <img src=${productos.img} class="card-img-top" alt="...">
            <div class="card-body">
              <h5 class="card-title">${productos.title}</h5>
              <p class="card-text">Precio: $${productos.price}</p>
              <p class="card-text">Stock: ${productos.stock}</p>
            </div>
        </div>
        `;
      })
      contenedorPromesa.innerHTML = agregadosHtml;
    })  
}

let abrePromesa = () => {
  contenedorFetch.classList.add("hidden");
  contendorBuscador.classList.add("hidden"); 
  contenedorPromesa.classList.remove("hidden");
  
  mostrarProductosPromesa();
};
btnPromesas.addEventListener("click",abrePromesa)


//-------FETCH------------//


let valueText2 = inputBuscarFetch

const cargaProductosFetch = async () => {
  console.log("valido33333",valueText2.value)
  let requestOptions = {
    method: 'GET',
    redirect: 'follow'
  };
  try{
  const getProduct = await fetch (
    `https://api.mercadolibre.com/sites/MLC/search?q=${valueText2.value}`, 
    requestOptions
    );
    console.log(getProduct)

    if(getProduct.status === 200){
      const getProductjson = await getProduct.json();
      console.log("test",getProductjson.query)

      console.log("datos ", getProductjson)
      getProductjsonArray = getProductjson.results

      console.log(getProductjsonArray)
      cleanResults()
      mostrarProductosFetch(getProductjsonArray)
      
    } else if (getProduct.status === 401) {
      console.log("DATOS ENVIADOS INCORRECTOS");
    } else if (getProduct.status === 404) {
      console.log("NO SE PUDO CONECTAR AL SERVIDOR - URL ERRONEA");
    } else {
      console.log("OCURRIO UN ERROR - NO ES ERROR 401 - 404");
    }

  }catch (error) {
    console.log(error);
  }
}

//ver mas gifs al apretar boton
const verMasBtn = document.querySelector('.vermas-btn')
verMasBtn.addEventListener ('click', seeMore) 

function seeMore(){
  pageNumber ++;
  mostrarProductosFetch(getProductjsonArray)
}


const mostrarProductosFetch = (_array) => {

  pagination = paginate(getProductjsonArray,pageSize,pageNumber)

  const gridResults = document.createElement("div")
  gridResults.setAttribute('class', 'grid-results') 
  contenedorFetch.appendChild(gridResults) 

  let agregadosHtml2 = "";
  pagination.map(agregadoHtml =>{
      agregadosHtml2 += `    
                      <div class="card" style="width: 18rem;">
                      <img src=${agregadoHtml.thumbnail} class="card-img-top" alt="...">
                        <div class="card-body">
                          <h5 class="card-title">${agregadoHtml.title}</h5>
                          <p class="card-text">Precio: $${agregadoHtml.price}</p>
                          <p class="card-text">Stock: ${agregadoHtml.available_quantity}</p>
                        </div>
                      </div>
            `;
  });
  gridResults.innerHTML = agregadosHtml2;

  pageCont = Math.ceil(getProductjsonArray.length/pageSize)
  console.log(pageNumber,pageCont)
  pageNumber < pageCont ? verMasBtn.classList.add('shown') : null
  pageNumber >= pageCont ? verMasBtn.classList.remove('shown') : null
};

let abreFetch = () => {
  contenedorPromesa.classList.add("hidden");
  contenedorFetch.classList.remove("hidden"); 
  contendorBuscador.classList.remove("hidden"); 
  //cargaProductosFetch(); 
};
btnFetch.addEventListener("click",abreFetch)

btnBuscarFetch.addEventListener("click",cargaProductosFetch)

//limpiar resultados
function cleanResults () {
  contenedorFetch.innerHTML = '';
  pageNumber=1;
}