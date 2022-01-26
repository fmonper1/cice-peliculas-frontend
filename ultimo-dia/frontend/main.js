import axios from "axios";

import "./style.css";
const input = document.querySelector("#nombre-peli");
const boton = document.querySelector("#buscar");
const vistaPrevia = document.querySelector("#vista-previa");
const listaPeliculas = document.querySelector("#mis-peliculas");

boton.addEventListener("click", async () => {
  console.log("click");
  console.log(input.value);

  const response = await axios.get(
    `https://www.omdbapi.com/?apikey=765b6f6a&t=${input.value}`
  );
  console.log(response);
  mostrarVistaPrevia(response.data);
});

// https://www.omdbapi.com/?apikey=765b6f6a&t=blade+runner

const mostrarVistaPrevia = (pelicula) => {
  const caratula = document.createElement("img");
  caratula.src = pelicula.Poster;
  caratula.className = "caratula";

  vistaPrevia.innerHTML = "";
  vistaPrevia.appendChild(caratula);

  const verificar = document.createElement("button");
  verificar.innerHTML = "OK";
  verificar.onclick = async () => {
    const info = await axios.post("http://localhost:5000/peliculas", {
      ...pelicula,
      tieneLike: false,
    });
    vistaPrevia.innerHTML = "";
    input.value = "";
    console.log(info);
    mostrarPeliculas();
  };

  vistaPrevia.appendChild(verificar);
};

// http://localhost:5000/peliculas
const mostrarPeliculas = async () => {
  listaPeliculas.innerHTML = "";

  const response = await axios.get("http://localhost:5000/peliculas");
  console.log(response.data);
  for (let i = 0; i < response.data.length; i++) {
    const pelicula = response.data[i];
    const contenedor = document.createElement("div");

    const borrar = document.createElement("button");
    borrar.innerHTML = "Borrar";
    contenedor.appendChild(borrar);

    if (!pelicula.tieneLike) {
      const meGusta = document.createElement("button");
      meGusta.innerHTML = "Me gusta";

      meGusta.onclick = async () => {
        const info = axios.patch(
          `http://localhost:5000/peliculas/${pelicula.id}/like`
        );
        mostrarPeliculas();
      };
      contenedor.appendChild(meGusta);
    } else {
      const noMeGusta = document.createElement("button");
      noMeGusta.innerHTML = "No me gusta";
      noMeGusta.onclick = async () => {
        const info = axios.patch(
          `http://localhost:5000/peliculas/${pelicula.id}/unlike`
        );
        mostrarPeliculas();
      };
      contenedor.appendChild(noMeGusta);
    }

    const div = document.createElement("div");
    div.textContent = `${pelicula.Title} - [${
      pelicula.tieneLike ? "me gusta" : "no me gusta"
    }]`;

    contenedor.appendChild(div);
    contenedor.className = "pelicula";

    listaPeliculas.appendChild(contenedor);
  }
};

mostrarPeliculas();
