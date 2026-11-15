class Pokemon {

    constructor(nombre, imagen, ps, atq, dfs, vel, ataques) {
        this.nombre = nombre;
        this.imagen = imagen;

        this.ps = ps;
        this.psActual = ps;

        this.atq = atq;
        this.dfs = dfs;
        this.vel = vel;

        this.atqOriginal = atq;
        this.dfsOriginal = dfs;

        this.ataques = ataques;
    }

    atacar(objetivo, ataque) {

        let daño;

        if (ataque == "Gruñido") {

            objetivo.atq = Math.round(objetivo.atq * 0.8);

            return this.nombre + " usó Gruñido. El ataque de " +
            objetivo.nombre + " bajó.";

        }

        if (ataque == "Látigo") {

            objetivo.dfs = Math.round(objetivo.dfs * 0.8);

            return this.nombre + " usó Látigo. La defensa de " +
            objetivo.nombre + " bajó.";

        }

        if (ataque == "Placaje" || ataque == "Arañazo") {

            daño = Math.round((40 * this.atq) / (objetivo.dfs * 2));

            objetivo.psActual = objetivo.psActual -
            (objetivo.ps * daño / 100);

            if (objetivo.psActual < 0) {
                objetivo.psActual = 0;
            }

            return this.nombre + " usó " + ataque +
            " e hizo " + daño + "% de daño.";

        }

    }

    reiniciar() {

        this.psActual = this.ps;
        this.atq = this.atqOriginal;
        this.dfs = this.dfsOriginal;

    }

}


// Crear los objetos Pokémon

let squirtle = new Pokemon(
    "Squirtle",
    "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/7.png",
    45, 49, 49, 43,
    ["Látigo", "Placaje"]
);

let bulbasaur = new Pokemon(
    "Bulbasaur",
    "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png",
    54, 38, 65, 45,
    ["Gruñido", "Placaje"]
);

let charmander = new Pokemon(
    "Charmander",
    "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/4.png",
    49, 42, 43, 65,
    ["Látigo", "Arañazo"]
);

let pokemones = [squirtle, bulbasaur, charmander];

let jugador;
let rival;


// Elegir Pokémon

function elegirPokemon(nombre) {

    for (let i = 0; i < pokemones.length; i++) {

        if (pokemones[i].nombre == nombre) {
            jugador = pokemones[i];
        }

    }

    let disponibles = [];

    for (let i = 0; i < pokemones.length; i++) {

        if (pokemones[i] != jugador) {
            disponibles.push(pokemones[i]);
        }

    }

    rival = disponibles[Math.floor(Math.random() * disponibles.length)];

    jugador.reiniciar();
    rival.reiniciar();

    document.getElementById("seleccion").style.display = "none";
    document.getElementById("batalla").style.display = "block";

    document.getElementById("nombreJugador").textContent = jugador.nombre;
    document.getElementById("imagenJugador").src = jugador.imagen;

    document.getElementById("nombreRival").textContent = rival.nombre;
    document.getElementById("imagenRival").src = rival.imagen;

    document.getElementById("ataque1").textContent = jugador.ataques[0];
    document.getElementById("ataque2").textContent = jugador.ataques[1];

    actualizarVida();

}


// Realizar turno

function jugarTurno(numero) {

    let ataqueJugador = jugador.ataques[numero];

    let numeroRival = Math.floor(Math.random() * 10) + 1;

    let ataqueRival;

    if (numeroRival == 2 || numeroRival == 8 || numeroRival == 10) {

        // Elegir ataque de estadísticas

        if (rival.ataques[0] == "Gruñido" || rival.ataques[0] == "Látigo") {
            ataqueRival = rival.ataques[0];
        } else {
            ataqueRival = rival.ataques[1];
        }

    } else {

        // Elegir ataque ofensivo

        if (rival.ataques[0] == "Placaje" || rival.ataques[0] == "Arañazo") {
            ataqueRival = rival.ataques[0];
        } else {
            ataqueRival = rival.ataques[1];
        }

    }

    let mensaje = "";

    if (jugador.vel >= rival.vel) {

        mensaje = jugador.atacar(rival, ataqueJugador);

        actualizarVida();

        if (rival.psActual <= 0) {
            terminarBatalla("¡Ganaste la batalla!");
            document.getElementById("mensaje").textContent = mensaje;
            return;
        }

        mensaje += " " + rival.atacar(jugador, ataqueRival);

    } else {

        mensaje = rival.atacar(jugador, ataqueRival);

        actualizarVida();

        if (jugador.psActual <= 0) {
            terminarBatalla("¡Perdiste la batalla!");
            document.getElementById("mensaje").textContent = mensaje;
            return;
        }

        mensaje += " " + jugador.atacar(rival, ataqueJugador);

    }

    actualizarVida();

    if (rival.psActual <= 0) {
        terminarBatalla("¡Ganaste la batalla!");
        return;
    }

    if (jugador.psActual <= 0) {
        terminarBatalla("¡Perdiste la batalla!");
        return;
    }

    document.getElementById("mensaje").textContent = mensaje;

}


// Actualizar vida y estadísticas

function actualizarVida() {

    let vidaJ = Math.round((jugador.psActual / jugador.ps) * 100);
    let vidaR = Math.round((rival.psActual / rival.ps) * 100);

    document.getElementById("vidaJugador").textContent = vidaJ + "%";
    document.getElementById("vidaRival").textContent = vidaR + "%";

    document.getElementById("barraJugador").style.width = vidaJ + "%";
    document.getElementById("barraRival").style.width = vidaR + "%";

    document.getElementById("statsJugador").textContent =
        "PS: " + Math.ceil(jugador.psActual) +
        " | ATQ: " + jugador.atq +
        " | DFS: " + jugador.dfs +
        " | VEL: " + jugador.vel;

    document.getElementById("statsRival").textContent =
        "PS: " + Math.ceil(rival.psActual) +
        " | ATQ: " + rival.atq +
        " | DFS: " + rival.dfs +
        " | VEL: " + rival.vel;

}


// Terminar batalla

function terminarBatalla(resultado) {

    document.getElementById("mensaje").textContent = resultado;

    document.getElementById("ataque1").style.display = "none";
    document.getElementById("ataque2").style.display = "none";

    document.getElementById("botonReiniciar").style.display = "inline-block";

}


// Reiniciar juego

function reiniciar() {

    document.getElementById("seleccion").style.display = "block";
    document.getElementById("batalla").style.display = "none";

    document.getElementById("ataque1").style.display = "inline-block";
    document.getElementById("ataque2").style.display = "inline-block";

    document.getElementById("botonReiniciar").style.display = "none";

    document.getElementById("mensaje").textContent = "¿Qué vas a hacer?";

}
