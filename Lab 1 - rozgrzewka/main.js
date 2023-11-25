const LICZBA1 = document.querySelector("#liczba1");
const LICZBA2 = document.querySelector("#liczba2");
const LICZBA3 = document.querySelector("#liczba3");
const LICZBA4 = document.querySelector("#liczba4");
const LICZBA = document.querySelector("input");

var inputs = [LICZBA1, LICZBA2, LICZBA3, LICZBA4];

const btnPrzelicz = document.querySelector("#przelicz");
const inputsDiv = document.querySelector("#inputs");
const btnDodaj = document.querySelector("#dodaj");
const btnUsun = document.querySelector("#usun");
const wynikiPojemnik = document.querySelector("#wyniki");

btnDodaj.addEventListener("click", () => {
  const ID = document.createElement("input");
  ID.setAttribute("type", "text");
  ID.id = `liczba${inputs.length + 1}`;
  inputsDiv.appendChild(ID);
  inputs.push(ID);
});

btnUsun.addEventListener("click", () => {
  const ID = document.querySelector(`#liczba${inputs.length}`);
  ID.remove();
  inputs.pop(ID);
  calc();
});

document.addEventListener("input", calc);

function calc() {
  let sum = 0;
  let avg = 0;
  let min = 0;
  let max = 0;
  let temp = [];

  inputs.forEach((element) => {
    sum += +element.value;
    temp.push(+element.value);
  });
  avg = sum / inputs.length;

  min = Math.min(...temp);
  max = Math.max(...temp);

  wynikiPojemnik.innerHTML = `Sum: ${sum} <br /> Avg: ${avg} <br /> Min: ${min} <br /> Max: ${max}`;
}
