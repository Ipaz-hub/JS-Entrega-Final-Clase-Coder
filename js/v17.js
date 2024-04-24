// Array con la cantidad de dados. Cada index del array representará un dado y su valor
let diceQuantity = []

// Array tan largo como la cantidad de dados a lanzar. Se usará para verificar si el juego se ha ganado o no.
let checkResults = []

// Variable sin valor designado para guardar el valor del los dados que se desea conservar después de cada lanzamiento
let diceResultToKeep 

// Variable que contará cuantos relanzamientos quedan. Será reasignado su valor por el usuario al comenzar el juego
let rerollSoFar = 0

// Guarda en localstorage el array con la cantidad de dados y su valor después de cada relanzamiento
let reRollNumberStorage = 0;

let victoriesSumUp;
let gamesSumUp;
let lossesSumUp;


function popUpRerolls () {
  anime({
    targets: "#historial-rerolls",
    scale: ['0%', '100%'],
    rotate: '1turn'
  });

  viewRolls()

  document.getElementById("call-rerolls-data").style.display="none"
}

function popDownRerolls () {

  const boxes = document.querySelectorAll('.reroll');
  boxes.forEach(box => {box.remove();});

  document.getElementById("call-rerolls-data").style.display="block"


  
  anime({
    targets: "#historial-rerolls",
    scale: ['100%', '0'],
    rotate: '1turn'
  });
 

}

document.getElementById("call-rerolls-data").addEventListener("click", () => {popUpRerolls()}) 
document.getElementById("cerrar_historial").addEventListener("click", () => {popDownRerolls()}) 


const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay))

function saveRoll(r) {
let stringRolls = JSON.stringify(diceQuantity);
localStorage.setItem("diceQuantity"+r, stringRolls);
reRollNumberStorage = reRollNumberStorage+1;
}

let arrayFromStorage = "";
let arrayParsed = "";

// Imprime en un div todos los array con la cantidad de dados y sus valores guardados en el local store.
function viewRolls() {

  document.getElementById("historial-rerolls").style.display = "block";



  for (i=0; i < rerollsGiven; i++) {
     arrayFromStorage = JSON.parse(localStorage.getItem("diceQuantity"+i));
     n = i+1; 
    if (arrayFromStorage != null ) {
     let divInfoReroll = document.createElement("div");
     divInfoReroll.setAttribute("id", "div-reroll"+i)
     divInfoReroll.setAttribute("class", "reroll")
     divInfoReroll.innerHTML = "Relanzamiento " + n + "<div>" + "[" + arrayFromStorage + "]" + "</div>"
     document.getElementById("historial-rerolls").append(divInfoReroll);


    document.getElementById("div-reroll"+i).append();

   }
   }
}



// Función que crea la imagen del dado. El parámetro es el valor del dado que se cargará como imagen

async function animeDice (a) {
 
  
anime({
  targets: a,
  scale: ['0%', '100%'],
  rotate: '1turn'
});

}




async function createDice(diceNumber) {
  if (diceNumber != diceResultToKeep) {
    await sleep(200)
    let newDice = document.createElement("IMG");
    newDice.src = "./img/dice_on_"+diceNumber+".png";
    newDice.classList.add("diceStyle", "number_"+diceNumber);
    document.getElementById("dice-container").appendChild(newDice);

    anime({
      targets: newDice,
      scale: ['0%', '100%'],
      rotate: '1turn'
    });
  }
  else {
    let newDice = document.createElement("IMG");
    newDice.src = "./img/dice_on_"+diceNumber+".png";
    newDice.classList.add("diceStyle", "number_"+diceNumber);
    document.getElementById("dice-container").appendChild(newDice); 
  }
  

  }



// Revisa el array con la cantidad de dados (diceQuantity) y los coloca en pantalla usando la función "createDice"
  async function reloadDiceView() { 

    document.getElementById("dice-container").innerHTML = "";
    
    for (let i=0; i < diceQuantity.length; i++) {
        switch (diceQuantity[i]) {
          case 1:
            createDice(1);
          break;
  
          case 2:
            createDice(2);
          break;
  
          case 3:
            createDice(3);
          break;
  
          case 4:
            createDice(4);
          break;
  
          case 5:
            createDice(5);
          break;
  
          case 6:
            createDice(6);
          break;
        }
    }   
  }

// Función para generar un número aleatorio entero entre 1 y 6. Será usado para representar el dado siendo lanzado.
function getRandomNumber(n) {
  return Math.floor((Math.random() * n )+1);
} 

// Función que verifica cuantos lanzamientos tiene el usuario. Cuando los lanzamientos se agoten, se terminará el while y se pasará a verificar si el usuario ha ganado o no  
async function runValidator () {
   
    if ( rerollSoFar < rerollsGiven ) {

      // Recorre todo el array de los dados para ver si todos tienen un mismo valor. relanzamiento.
        for (i=1; i < 7; i++) {
          
          // Se recorre cada index de diceQuantity, partiendo por la posición 0. Si el index consultado tiene el mismo valor de "i" se coloca true en ese index en el array checkResults, de lo contrario, se coloca false
          let n=0
      
          while (n < checkResults.length) {
             if (diceQuantity[n] == i) {
                 checkResults[n] = true 
                 n++
             }
             else {
                 checkResults[n] = false
                 n++ 
             }
          //se verifica con la función "checkResultsValidator" si todo el array tiene true. Se corta el while, y se agotan los relanzamientos
          if (checkResults.every(checkResultsValidator))
              {
                  rerollSoFar = rerollsGiven
                  i = 6
                  gameEnd();
              }
          
          }
      
         
        }

        if ( rerollSoFar != rerollsGiven) {
        resultSoFar (rerollsGiven, rerollSoFar);
        }

    }
   
      else {
        gameEnd()
       
      }
    
}

// Relanza todos los dados con valores distintos al que el usuario quiere conservar y llama a reloadDiceView para recargar los dados en pantalla con sus nuevos valores.
function rerollButKeepaNumber() { 
 
    for (i= 0; i < diceQuantityGiven; i++) {
      if (diceQuantity[i] !== diceResultToKeep) {
        diceQuantity[i] =(getRandomNumber(6));
      }
      
    }
    reloadDiceView();
    rerollSoFar++
    runValidator();
  }


//Se activa al presiona uno de los botones generados por la function resultSoFar. Define cual es el valor que el usuario desea conservar para el siguiente relanzamiento.

async function keep(i) {
  saveRoll(reRollNumberStorage); //almacena el array con los nuevos resultados de los dadots
  diceResultToKeep = i;
  rerollButKeepaNumber() //relanza los dados nuevamente, pero manteniendo los dados con los valores que el usuario quiere conservar
}




// Funcion que indicará al usuario el status del juego en el momento y preguntará cual valor de dado desea conservar para el siguiente relanzamiento. Esto lo hace creando 6 botones en pantalla con un "onclick". Por ejemplo si presiona un "6", todos los dados de valor 6 no serán relanzados. 

async function resultSoFar (b, c) {
    let resultsSoFarDiv = document.getElementById("anuncios");
    resultsSoFarDiv.innerHTML="<p><b>¡Se han lanzado los dados!</b><br> ¿Cual valor quieres conservar para el siguiente lanzamiento?,te quedan " + (b - c) + " relanzamiento/s</p>";

    let buttonDiceKeepNumber = document.createElement("button");
      buttonDiceKeepNumber.setAttribute('id', 0);
      buttonDiceKeepNumber.classList.add("btn-keep-dice", "hidden", "selected");
      buttonDiceKeepNumber.innerText = 0; 
      buttonDiceKeepNumber.addEventListener('click', handleButtonClick);
      document.getElementById("anuncios").appendChild(buttonDiceKeepNumber);

    for (i=1; i<7; i++) {
      let buttonDiceKeepNumber = document.createElement("button");
      buttonDiceKeepNumber.setAttribute('id', i);
      buttonDiceKeepNumber.classList = "btn-keep-dice";
      buttonDiceKeepNumber.innerText = +i; 
      buttonDiceKeepNumber.addEventListener('click', handleButtonClick);
      document.getElementById("anuncios").appendChild(buttonDiceKeepNumber);
    }

    function handleButtonClick(event) {
      // Remove the "selected" class from all buttons
      let buttons = document.querySelectorAll('.btn-keep-dice');
      buttons.forEach(function(button) {
        anime({
          targets: ".selected",
          borderRadius: ['50%', '20px'],
          background:"#d4d4d4",
          rotate: '1turn'
        });
        button.classList.remove('selected');
      });

      // Add the "selected" class to the clicked button
      event.target.classList.add('selected');
      anime({
        targets: ".selected",
        //translateX: 270,
        borderRadius: ['20px', '50%'],
        background:"#FFC300",
        rotate: '1turn'
      });
    }

    let btnCraneToRollDice = document.createElement("button");
    btnCraneToRollDice.setAttribute('id', "rollTheDice");
    btnCraneToRollDice.innerHTML = "<b>¡Lanzar Dados!</b>"; 
    btnCraneToRollDice.addEventListener('click', handleActiveCrane);
    document.getElementById("anuncios").appendChild(btnCraneToRollDice);


    function handleActiveCrane(event) {
      lol = parseInt(document.querySelector('.selected').id);
      keep(lol);
    }
   
}


// Función para ser usada con el método "every()" para checkear si todos los dados tienen el mismo valor
function checkResultsValidator(checkResults) {
    return checkResults == true;
}

// Función que verifica el resultado de la partida
function gameEnd() {

  document.getElementById("status").style.display="block";

  if (checkResults.every(checkResultsValidator)){
    saveVictories(1,1,0)
    document.getElementById("anuncios").innerHTML= "Todos tus dados son iguales <br> <h2>¡Felicidades has ganado!</h2>";
    document.getElementById("volver-a-jugar").style="display:block";
  }
  else {
    saveVictories(0,1,1)
    document.getElementById("anuncios").innerHTML= "No has logrado que los dados sean iguales <br> <h2>¡Felicidades has perdido! XD</h2>";
    document.getElementById("volver-a-jugar").style="display:block";


  }
}

document.getElementById("volver-btn").addEventListener("click", () => { restartGame()}) 

function restartGame() { 
  
for (i=0; i < rerollsGiven; i++) {
  localStorage.removeItem("diceQuantity"+i);
   }

   location.reload();

  }

//Función que gatillará el comienzo de la partida

function gameStartFunction() {


  //remueve todos los rerolls del cache
  for (i=0; i < rerollsGiven; i++) {
    localStorage.removeItem("diceQuantity"+i);
     }

  for (let i = 0; i < diceQuantityGiven; i++) {
      diceQuantity.push(getRandomNumber(6));
  // Se define la extensión del array que chequeará los resultados del lanzamiento
      checkResults.push(null);
  }

    reloadDiceView() ;
    resultSoFar (rerollsGiven, rerollSoFar);
  

  
  }

// Formulario del INICIO DE LA PARTIDA

let gameStartForm = document.getElementById("gameStartForm")
let diceQuantityGivenInput = document.getElementById("diceQuantityInput")
let rerollsGivenInput = document.getElementById("diceRerollInput")

// Formulario de selección de dados
let craneToRollDice = document.getElementById("choose-dice")

//Con un listener se detecta si se ha presionado enviar. Toma los datos de cuantos dados se van a lanzar y cuantos lanzamientos. Después reemplaza los valores de ambas variables por los valore entregados. Finalmente, oculta el formulario para estos datos durante la partida.
gameStartForm.addEventListener("submit", (n) => {n.preventDefault(); diceQuantityGiven = diceQuantityGivenInput.value; rerollsGiven = rerollsGivenInput.value; gameStartFunction(); gameStartForm.style.cssText="display:none"; })


function saveVictories(a,b,c) {

let victory = localStorage.getItem("Victories");

if (victory == null) {
victoriesSumUp = 0;
gamesSumUp = 0;
lossesSumUp = 0;
 

localStorage.setItem("Victories", victoriesSumUp);
localStorage.setItem("Games", gamesSumUp);
localStorage.setItem("Losses", lossesSumUp);
}

victoriesSumUp = parseInt(localStorage.getItem("Victories"))
gamesSumUp = parseInt(localStorage.getItem("Games"))
lossesSumUp = parseInt(localStorage.getItem("Losses"))

localStorage.setItem("Victories", JSON.stringify(victoriesSumUp+a));
localStorage.setItem("Games", JSON.stringify(gamesSumUp+b));
localStorage.setItem("Losses", JSON.stringify(lossesSumUp+c));

victoriesSumUp = parseInt(localStorage.getItem("Victories"))
gamesSumUp = parseInt(localStorage.getItem("Games"))
lossesSumUp = parseInt(localStorage.getItem("Losses"))


document.getElementById("id-victories").innerText = victoriesSumUp;
document.getElementById("id-games").innerText = gamesSumUp;
document.getElementById("id-losses").innerText = lossesSumUp;
}


function saveVictoriesRESPALDO(a,b,c) {

  let victory = localStorage.getItem("Victories");
  
  if (victory == null) {
  victoriesSumUp = 0;
  gamesSumUp = 0;
  lossesSumUp = 0;
   
  
  localStorage.setItem("Victories", victoriesSumUp);
  localStorage.setItem("Games", gamesSumUp);
  localStorage.setItem("Losses", lossesSumUp);
  }

  else
  
  {
  victoriesSumUp = parseInt(localStorage.getItem("Victories"))
  gamesSumUp = parseInt(localStorage.getItem("Games"))
  lossesSumUp = parseInt(localStorage.getItem("Losses"))
  }
  
  localStorage.setItem("Victories", JSON.stringify(victoriesSumUp+a));
  
  localStorage.setItem("Games", JSON.stringify(gamesSumUp+b));
  localStorage.setItem("Losses", JSON.stringify(lossesSumUp+c));
  
  
  document.getElementById("id-victories").innerText = victoriesSumUp;
  document.getElementById("id-games").innerText = gamesSumUp;
  document.getElementById("id-losses").innerText = lossesSumUp;
  }
  
  
  