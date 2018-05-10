/*
Apuntes:
-Al subir de nivel la expMAX aumentara un ratio(0.1)
-
*/
// ******************************************
// INICIALIZAR OBJETOS Y VARIABLES GLOBALES
// ******************************************
    
    //VECTOR DE OBJETOS, QUE SON LOS ENEMIGOS CON SUS STATS
    var enemigos = [ //LA EXP Y DINERO ES LO QUE OTORGA AL MATARLO
        { nombre: "Slime", ataque: 2, defensa: 5, vida: 70, dinero:50, exp: 50, aspecto: "img/enemigo1.gif" },
        { nombre: "Ent", ataque: 5, defensa: 10, vida: 100, dinero:75, exp: 50, aspecto: "img/enemigo2.gif" },
        { nombre: "Homunculo", ataque: 10, defensa: 5, vida: 200, dinero:100, exp: 100, aspecto: "img/enemigo3.gif" },
        { nombre: "Zombie", ataque: 15, defensa: 0, vida: 120, dinero:110, exp: 150, aspecto: "img/enemigo4.gif" },
        { nombre: "Dragon", ataque: 30, defensa: 30, vida: 500, dinero:200, exp: 1000, aspecto: "img/boss1.gif" },
    ];
    
    // CONSTRUCTOR DE PERSONAJE
    function cPersonaje(nombre){
        this.id = "";
        this.nombre = nombre; // string
        this.ataque= 0; // number
        this.defensa= 0; // number
        this.especial= 0; // number
        this.vida= 0; // number
        this.vidaMAX= 0; // number
        this.dinero= 0; // number - sirven para comprar items en la tienda
        this.exp= 0; // number - sirve para subir de lvl y darte puntos para subir this stats
        this.expMAX= 0; // number
        this.nivel= 0; // number
        this.puntosDisponibles= 0; // number - sirven para subir tus stats
        this.aspecto= "img/personajes/cloud2.png"; // string
        this.misionActual= 0; // number
        this.equipo= []; // array<Objeto>
    }
    
    //CONSTRUCTOR DE OBJETOS
    function cObjeto(nombreObjeto,tipoObjeto,aumentaObjeto,valorObjeto,elementoObjeto,precioObjeto,descripcionObjeto,equipadoObjeto){
        this.nombre = nombreObjeto; // string
        this.tipo = tipoObjeto; // string
        this.aumenta = aumentaObjeto; // string
        this.valor = valorObjeto; // number
        this.elemento = elementoObjeto; // string
        this.precio = precioObjeto; // number
        this.descripcion = descripcionObjeto; // string
        this.equipado = equipadoObjeto; // string
    }
    //CONSTRUCTOR DE ENEMIGOS, RECORRE EL ARAY Y SEGUN EL NUMERO CREA UNO U OTRO
    function cEnemigo(numEnemigo){
        this.nombre = enemigos[numEnemigo].nombre; // string
        this.ataque = enemigos[numEnemigo].ataque; // number
        this.defensa = enemigos[numEnemigo].defensa; // number
        this.vida = enemigos[numEnemigo].vida; // number
        this.dinero = enemigos[numEnemigo].dinero; // number
        this.exp = enemigos[numEnemigo].exp; // number
        this.aspecto = enemigos[numEnemigo].aspecto; // string
    }
    //CONSTRUCTOR DE MISIONES  con MUNDOS
    function cMision(codMundo,nombreMundo,codMision,nombreMision,misionDescripcion){
        this.codMundo = codMundo; // int
        this.nombreMundo = nombreMundo; // string
        this.codMision = codMision; // int
        this.nombreMision = nombreMision; // string
        this.misionDescripcion = misionDescripcion; // string
    }
    
    // ***** VARIABLE GLOBAL PARA CARGAR LA MISION CON ESE ENEMIGO *****
    var enemigoActual; // enemigo actual en combate
    var pj = new cPersonaje("Yo"); // personaje 
    var misionesJuego = []; // array de mundos con misiones
    var tienda = []; // array de objetos
    
// **********************************************
//                  INICIO JUEGO
// **********************************************

window.onload = function() {
    console.log("///   JUEGO CARGADO   ///"); // para debug
    document.getElementById("menuJuego").style.display = "none";
    //SABER SI SE LOGEA
    $("#btnEmpezarJuego").click(function(){
        if($("#inputUsuario").val() != "" && $("#inputPass").val() != ""){
             ajaxCargarPersonaje("Login");
             ajaxCargarMisiones();
             ajaxCargarTienda();
        }
        else{
            alert("Algun campo esta vacio.")
        }
    });
    
    //O SABER SI SE REGISTRA
    $("#btnRegistrarse").click(function(){
        if($("#inputUsuario").val() != "" && $("#inputPass").val() != ""){
            ajaxCargarPersonaje("Registro");
            ajaxCargarMisiones();
            ajaxCargarTienda();
        }
        else{
            alert("Algun campo esta vacio.")
        }
    });

    
    //CARGAR MISIONES
    document.getElementById("menu-misiones").onclick = cargarMundos;
    //CARGAR ESTADISTICAS JUGADOR
    document.getElementById("menu-personaje").onclick = cargarPersonaje;
    //CARGAR LA TIENDA
    document.getElementById("menu-tienda").onclick = cargarTienda;
    //CARGAR inventario
    document.getElementById("menu-inventario").onclick = cargarInventario;
    //-------
    // document.getElementById("btnAtaque").onclick = function(){
    //     //TODO
    // };
    // document.getElementById("btnDefensa").onclick = function(){
    //     //TODO
    // };
    // document.getElementById("btnEspecial").onclick = function(){
    //     //TODO
    // };
    
}
// *************************
//  INICIO FUNCIONES JUEGO
// *************************

function sumarStats(stat){
    //SI HAY PUNTOS DISPONIBLES SUMARA A LOS STATS
    if(pj.puntosDisponibles != 0){
        if(stat == "Ataque"){
            pj.ataque++;
            document.getElementById("statAtaque").innerHTML = pj.ataque;
        }
        else if(stat == "Defensa"){
            pj.defensa++;
            document.getElementById("statDefensa").innerHTML = pj.defensa;
        }
        else if(stat == "Especial"){
            pj.especial++;
            document.getElementById("statEspecial").innerHTML = pj.especial;
        }
        pj.puntosDisponibles--;
        document.getElementById("statPuntosDisponibles").innerHTML = pj.puntosDisponibles;
        //cargarPersonaje();
    }
}

//COMPROBARA SI EL PJ TIENE EL ITEM EQUIPADO, SINO SALDRA UNA (X)
function comprobarItem(nombreItem){
    var existe = "X";
    
    for(var i in pj.equipo){
        // SI COINCIDE Y ESTA EQUIPADO (S/N)
        if(pj.equipo[i].tipo == nombreItem && pj.equipo[i].equipado == 'S'){
            existe = pj.equipo[i].nombre;
        }
    }
    return existe;
}

//CARGA EL MENU DE STATS DEL PJ
function cargarPersonaje(){
    //VACIA ANTES DE RELLENAR
    document.getElementById("juego").innerHTML = "";
    
    var texto = '';
    texto += '<div class="col-md-3 text-light itemsPJ">';
    texto +=    '<p>('+comprobarItem("Espada")+')</p>';
    texto +=    '<div><img id="espada" src="img/'+comprobarItem("Espada")+'.png"></div>';
    texto +=    '<p>('+comprobarItem("Armadura")+')</p>';
    texto +=    '<div><img id="armadura" src="img/'+comprobarItem("Armadura")+'.png"></div>';
    texto +=    '<p>('+comprobarItem("Anillo")+')</p>';
    texto +=    '<div><img id="anillo" src="img/'+comprobarItem("Anillo")+'.png"></div>';
    texto += '</div>';
    texto += '<div class="col-md-6">';
    texto +=    '<div class="row">';
    texto +=        '<div class="col">';
    texto +=            '<h2 class="text-light bg-dark">'+pj.nombre+' Nvl. ('+pj.nivel+') Exp('+pj.exp+'/'+pj.expMAX+')</h2>';
    texto +=        '</div>';
    texto +=    '</div>';
    texto +=    '<img class="img-fluid" src="'+pj.aspecto+'"></img>';
    texto +=    '<div class="row text-light pt-3">';
    texto +=        '<div class="col">';
    texto +=            '<span>Ataque: <span id="statAtaque">'+pj.ataque+'</span></span> <button onclick="sumarStats('+"'Ataque'"+')" type="button">+</button><span> // </span>';
    texto +=            '<span>Defensa: <span id="statDefensa">'+pj.defensa+'</span></span> <button onclick="sumarStats('+"'Defensa'"+')" type="button">+</button><span> // </span>';
    texto +=            '<span>Especial: <span id="statEspecial">'+pj.especial+'</span></span> <button onclick="sumarStats('+"'Especial'"+')" type="button">+</button>';
    texto +=            '<p>Puntos disponibles: (<span id="statPuntosDisponibles">'+pj.puntosDisponibles+'</span>)</p>';
    texto +=        '</div>';
    texto +=    '</div>';
    texto += '</div>';
    texto += '<div class="col-md-3 text-light itemsPJ">';
    texto +=    '<p>('+comprobarItem("Escudo")+')</p>';
    texto +=    '<div><img id="escudo" src="img/'+comprobarItem("Escudo")+'.png"></div>';
    texto +=    '<p>('+comprobarItem("Casco")+')</p>';
    texto +=    '<div><img id="casco" src="img/'+comprobarItem("Casco")+'.png"></div>';
    texto +=    '<p>('+comprobarItem("Consumible")+')</p>';
    texto +=    '<div><img id="itemEspecial" src="img/'+comprobarItem("Consumible")+'.png"></div>';
    texto += '</div>';

    
    document.getElementById("juego").innerHTML = texto;
    document.getElementById("juego").style.backgroundImage = "url('img/fondos/fondomadera.jpg')";
    console.log("- Personaje Actualmente -"); // para debug
    console.log(pj); // para debug
}

//CARGARA LA MISION QUE ELIJAS Y NO PODRAS SALIR HASTA COMPLETARLA
function entrarMision(numMision) {
    var texto = "";
    
    enemigoActual = new cEnemigo(numMision);
    
    
    //DESACTIVA LOS MENUS MIENTRAS ESTAS EN BATALLA
    document.getElementById("menu-misiones").disabled = true;
    document.getElementById("menu-personaje").disabled = true;
    document.getElementById("menu-tienda").disabled = true;
    document.getElementById("menu-inventario").disabled = true;
    
    document.getElementById("juego").innerHTML = "";
    texto += ' <div class="col-md-2 col-2">';
    texto += ' <div id="posEnemigo1" style="border:solid gray 1px">';
    texto += ' </div>';
    texto += ' <div id="posEnemigo2" style="border:solid gray 1px">';
    texto += ' <div class="progress">';
    texto += ' <div id="vidaEnemigo1" class="progress-bar bg-success" role="progressbar" style="width: 100%" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100">'+enemigoActual.vida+'</div>';
    texto += ' </div>';
    texto += ' <img id="enemigo1" src="'+enemigoActual.aspecto+'" style="height:5rem" class="img-fluid">';
    texto += ' </div>';
    texto += ' <div id="posEnemigo3" style="border:solid gray 1px">';
    texto += ' </div>';
    texto += ' </div>';
    texto += ' <div class="col-md-2 col-2">';
    texto += ' <div id=""></div>';
    texto += ' <div id="posEnemigo1A"></div>';
    texto += ' <div id="posEnemigo2A"></div>';
    texto += ' <div id="posEnemigo3A"></div>';
    texto += ' <div id=""></div>';
    texto += ' </div>';
    texto += ' <div class="col-md-4 col-4">';
    texto += ' <div id="" style="border:solid black 1px;background:url('+"img/fondos/transparente.png"+');color:white; display:flex; align-items: center;">';
    texto += ' CAMPO DE TEXTO DONDE SALDRA LOS DAÑOS ETC';
    texto += ' </div>';
    texto += ' </div>';
    texto += ' <div class="col-md-2 col-2">';
    texto += ' <div id=""></div>';
    texto += ' <div id="posAliado1A"></div>';
    texto += ' <div id="posAliado2A"></div>';
    texto += ' <div id="posAliado3A"></div>';
    texto += ' <div id=""></div>';
    texto += ' </div>';
    texto += ' <div class="col-md-2 col-2">';
    texto += ' <div id="" style="border:solid gray 1px"></div>';
    texto += ' <div id="posAliado1" style="border:solid gray 1px">';
    texto += ' <div class="progress-bar bg-success" role="progressbar" style="width: 100%" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100">'+pj.vida+'</div>';
    texto += ' <img src="img/pj1.gif" id="aliado1" style="height:5rem" class="img-fluid">';
    texto += ' </div>';
    texto += ' <div id="" style="border:solid gray 1px"></div>';
    texto += ' </div>';
    texto += ' <div class="container-fluid" style="background:url('+"img/fondos/fondometal.gif"+')">';
    texto += ' <div class="row border border-dark">';
    texto += ' <div class="col">';
    texto += ' <div id="ataque"><button type="button" id="btnAtaque" class="btn btn-danger btn-lg btn-block">Atacar</button></div>';
    texto += ' </div>';
    texto += ' <div class="col">';
    texto += ' <div id="defensa"><button type="button" id="btnDefensa" class="btn btn-info btn-lg btn-block">Defender</button></div>';
    texto += ' </div>';
    texto += ' <div class="col">';
    texto += ' <div id="especial"><button type="button" id="btnEspecial" class="btn btn-warning btn-lg btn-block">Ataque Especial - Turnos(<span id="turnosEspecial">1</span>)</button></div>';
    texto += ' </div>';
    texto += ' </div>';
    texto += ' </div>';
    
    document.getElementById("juego").innerHTML = texto;
    document.getElementById("juego").style.backgroundImage = "url('img/fondos/fondoverde.jpg')";
    
}

function cargarMundos(){
    document.getElementById("juego").innerHTML = ""; // vaciar
    let textoMisiones = "";
    
    for(let i in misionesJuego){
        textoMisiones+='<div class="col-6 misiones">';
        textoMisiones+='    <h2 id="numMundo"> Mundo '+misionesJuego[i].idMundo+' </h2>';
        
            for(let j in misionesJuego[i].listaMisiones){
                textoMisiones+='    <div><span class="badge badge-pill badge-primary">'+misionesJuego[i].listaMisiones[j].idMision+'º Misión</span><div><button type="button" id="'+misionesJuego[i].listaMisiones[j].idMision+'" class="btn btn-warning" data-toggle="tooltip" data-placement="bottom" title="'+misionesJuego[i].listaMisiones[j].misionDescripcion+'">'+misionesJuego[i].listaMisiones[j].nombreMision+'</button></div></div>';
            }
        textoMisiones+='</div>';
    }
    document.getElementById("juego").innerHTML = textoMisiones;
    document.getElementById("juego").style.backgroundImage = "url('img/fondos/fondomisiones.jpg')";
}

function cargarInventario(){
    document.getElementById("juego").innerHTML = ""; // vaciar
    let textoInventario = '<div class="col-12 text-light">';
    textoInventario += '<h1> Inventario </h1>';
    textoInventario += '</div>';
    
    for(let i in pj.equipo){
        textoInventario += '<div class="col-3 text-light itemsPJ">';
        textoInventario += '<p>'+pj.equipo[i].nombre+'</p>';
        textoInventario += '<img src="img/'+pj.equipo[i].nombre+'.png">';
        textoInventario += '<p>'+pj.equipo[i].aumenta+': '+pj.equipo[i].valor+' pnts.</p>';
        if(pj.equipo[i].equipado == 'N'){
            textoInventario += '<div class="m-2"><button onclick="equiparObjeto(\''+pj.equipo[i].nombre+'\',\''+pj.equipo[i].tipo+'\')" type="button" class="btn btn-warning">Equipar</button></div>';
        } else {
            textoInventario += '<div class="m-2"><button type="button" class="btn btn-danger" disabled>Equipado</button></div>';
        }
        textoInventario += '</div>';
    }
    
    document.getElementById("juego").innerHTML = textoInventario;
    document.getElementById("juego").style.backgroundImage = "url('img/fondos/fondomadera.jpg')";
}

function cargarTienda(){
    document.getElementById("juego").innerHTML = ""; // vaciar
    let textoTienda = '<div class="col-12 text-light">';
    textoTienda += '<h1> Tienda </h1>';
    textoTienda += '<p>Dinero disponible '+pj.dinero+'$</p>';
    textoTienda += '</div>';
    
    for(let i in tienda){
        textoTienda += '<div class="col-3 text-light itemsPJ">';
        textoTienda += '<p>'+tienda[i].nombre+'</p>';
        textoTienda += '<img src="img/'+tienda[i].nombre+'.png">';
        textoTienda += '<p>'+tienda[i].aumenta+': '+tienda[i].valor+' pnts.</p>';
        textoTienda += '<p>Elemento: '+tienda[i].elemento+'.</p>';
        
        if(!comprobarObjetoTienda(tienda[i].nombre, tienda[i].tipo)){
            textoTienda += '<div class="m-2"><button onclick="comprarObjeto(\''+tienda[i].nombre+'\',\''+tienda[i].tipo+'\')" type="button" class="btn btn-success">Comprar '+tienda[i].precio+'$</button></div>';
        } else {
            textoTienda += '<div class="m-2"><button type="button" class="btn btn-danger" disabled>Ya comprado</button></div>';
        }
        
        //textoTienda += '<div class="m-2"><button onclick="comprarObjeto(\''+tienda[i].nombre+'\',\''+tienda[i].tipo+'\')" type="button" class="btn btn-success">Comprar '+tienda[i].precio+'$</button></div>';
        textoTienda += '</div>';
    }
    
    document.getElementById("juego").innerHTML = textoTienda;
    document.getElementById("juego").style.backgroundImage = "url('img/fondos/fondomadera.jpg')";
}

function comprobarObjetoTienda(objetoNombre, objetoTipo){
    let objetoExiste = false;
    // comprueba si ya tienes ese objeto
    for(let j in pj.equipo){
        if(pj.equipo[j].nombre == objetoNombre && pj.equipo[j].tipo == objetoTipo){
            objetoExiste = true;
        }
    }
    return objetoExiste;
}

function comprarObjeto(objetoNombre, objetoTipo){
    // recorre la tienda
    for(let i in tienda){
        //comprueba que es el objeto de la tienda (siempre lo sera)
        if(tienda[i].nombre == objetoNombre){
            console.log("Tienda: " + tienda[i].precio + "<= PJ: " + pj.dinero);
            // comprueba si tiene dinero para comprarlo
            if(tienda[i].precio <= pj.dinero){
                // compra y equipa
                alert(objetoNombre + " Comprado !");
                console.log(objetoNombre + " Comprado ***"); // para debug 
                pj.dinero -= tienda[i].precio;
                let objetoComprado = new cObjeto(tienda[i].nombre,tienda[i].tipo,tienda[i].aumenta,tienda[i].valor,tienda[i].elemento,tienda[i].precio,tienda[i].descripcion,'N')
                pj.equipo.push(objetoComprado);
                //equiparObjeto(objetoNombre,objetoTipo);
                cargarTienda(); // refrescas la tienda
            } else {
                alert("No te llega el dinero, toca farmear !");
            }
        }
    }
}

function equiparObjeto(objetoNombre, objetoTipo){
    // recorre el equipo
    for(let i in pj.equipo){
        // todos los del mismo tipo se desequipan
        if(pj.equipo[i].tipo == objetoTipo){
            pj.equipo[i].equipado = 'N';
        }
        // si coincide el nombre lo equipa
        if(pj.equipo[i].nombre == objetoNombre){
            alert(objetoNombre + " Equipado !");
            console.log(objetoNombre + " Equipado ***"); // para debug 
            pj.equipo[i].equipado = 'S';
        }
    }
    cargarInventario(); // refresca la pagina
}


// ****************************************************
//      FUNCIONES AJAX ( CONEXION SERVIDOR )
// ****************************************************

function ajaxCargarPersonaje(tipoAcceso) {
      let xhttp = new XMLHttpRequest();
      let nombreUsuario = $("#inputUsuario").val();
      let passUsuario = $("#inputPass").val();
    
      xhttp.onreadystatechange = function() {//Cada vez que el request reciba una respuesta y cambie de estado, entrará aquí
      
        if (this.readyState == 4 && this.status == 200) {
            //COMPRUEBA SI EXISTE YA EL USUARIO, 0--> YA EXISTE Y DISTINTO ES QUE NO EXISTE
            if(this.responseText != 0){
                //RECOGER LOS DATOS DEL PHP Y SEPARANDOLO CON SPLIT
                let datos=JSON.parse(xhttp.responseText);
                
                pj.nombre = datos["Nombre"];
                pj.ataque = datos["Ataque"];
                pj.defensa = datos["Defensa"];
                pj.especial = datos["Especial"];
                pj.vida = datos["Vida"];
                pj.vidaMAX = datos["VidaMAX"];
                pj.dinero = datos["Dinero"];
                pj.exp = datos["Exp"];
                pj.expMAX = datos["ExpMAX"];
                pj.nivel = datos["Nivel"];
                pj.puntosDisponibles = datos["PuntosDisponibles"];
                pj.aspecto = datos["Aspecto"];
                pj.misionActual = datos["MisionActual"];
                //INTRODUCE EL EQUIPO DEL PJ
                for(let i in datos["Equipo"]){
                    //alert(datos["Equipo"][i]["nombreEquipo"]);
                    let objetoActual = new cObjeto(datos["Equipo"][i]["nombreEquipo"],datos["Equipo"][i]["tipo"],
                    datos["Equipo"][i]["aumenta"],datos["Equipo"][i]["valor"],datos["Equipo"][i]["elemento"],datos["Equipo"][i]["precio"],datos["Equipo"][i]["descripcion"],datos["Equipo"][i]["equipado"]);
                    
                    pj.equipo.push(objetoActual);
                }
                
                document.getElementById("menuJuego").style.display = "";
                $("#myModal").modal();
                cargarPersonaje();
            }
            //HAY UNO DE LOS 2 ERRORES
            else{
                if(tipoAcceso == "Registro"){
                    alert("El usuario ya existe, intentalo otra vez.");
                }
                else{
                    alert("El usuario no existe o la contraseña es incorrecta!");
                }
            }
            console.log("*** AJAX Personaje Inicio ***"); // para debug
            console.log(pj); // para debug
        }
        else {
           //alert("");
        }
      };
      //SI ES REGISTRO
      if(tipoAcceso == "Registro"){
          xhttp.open("GET", "./php/ajaxRegistro.php?nombreUsuario="+nombreUsuario+"&passUsuario="+passUsuario, true);
      }
      //SINO ES LOGIN
      else{
          xhttp.open("GET", "./php/ajaxLogin.php?nombreUsuario="+nombreUsuario+"&passUsuario="+passUsuario, true);
      }
      xhttp.send();
    }

function ajaxCargarMisiones(){
        let mundoActialPosAux = 0; // Guarda la posicion del ultimo mundo
        let mundoActialIdAux = 0; // Guarda la id del ultimo mundo
        let xhttp = new XMLHttpRequest();
    
      xhttp.onreadystatechange = function() {//Cada vez que el request reciba una respuesta y cambie de estado, entrará aquí
      
        if (this.readyState == 4 && this.status == 200) {
            //RECOGER LOS DATOS DEL PHP Y SEPARANDOLO CON SPLIT
            let datos=JSON.parse(xhttp.responseText);
               
            //INTRODUCE MISIONES A LOS MUNDOS
            for(let i in datos["Misiones"]){
                //SI NO HAY UN MUNDO LO CREA
                if(mundoActialIdAux != datos["Misiones"][i]["idMundo"]){
                    // TAMBIEN INSERTA LA MISION DENTRO DE LA PROPIEDAD ListaMisiones
                    let mundoAux = {
                        idMundo:datos["Misiones"][i]["idMundo"],
                        nombreMundo:datos["Misiones"][i]["nombreMundo"],
                        listaMisiones:[{
                            idMision:datos["Misiones"][i]["idMision"],
                            nombreMision:datos["Misiones"][i]["nombreMision"],
                            misionDescripcion:datos["Misiones"][i]["misionDes"]
                        }]
                    };
                    
                    misionesJuego.push(mundoAux);
                    
                    mundoActialPosAux = [i];
                    mundoActialIdAux = datos["Misiones"][i]["idMundo"];
                }else{
                    // SINO SI YA EXISTE SOLO HACE PUSH DE LA MISION A LA PROPIEDAD ListaMisiones
                    let misionAux = {
                        idMision:datos["Misiones"][i]["idMision"],
                        nombreMision:datos["Misiones"][i]["nombreMision"],
                        misionDescripcion:datos["Misiones"][i]["misionDes"]
                    };
                    
                    misionesJuego[mundoActialPosAux].listaMisiones.push(misionAux);
                }
            }
            console.log("*** AJAX Misiones cargadas ***"); // para debug
            console.log(misionesJuego); // para debug
            
        }
      };

    xhttp.open("GET", "./php/ajaxCargarMisiones.php?", true);
    xhttp.send();
    
}

function ajaxCargarTienda(){
        let xhttp = new XMLHttpRequest();
    
      xhttp.onreadystatechange = function() {//Cada vez que el request reciba una respuesta y cambie de estado, entrará aquí
      
        if (this.readyState == 4 && this.status == 200) {
            //RECOGER LOS DATOS DEL PHP Y SEPARANDOLO CON SPLIT
            let datos=JSON.parse(xhttp.responseText);
               
            //INTRODUCE MISIONES A LOS MUNDOS
            for(let i in datos["Tienda"]){
                let objetoTiendaActual = {
                    idObjeto : datos["Tienda"][i]["idObjeto"],
                    nombre : datos["Tienda"][i]["nombre"],
                    tipo : datos["Tienda"][i]["tipo"],
                    aumenta : datos["Tienda"][i]["aumenta"],
                    valor : datos["Tienda"][i]["valor"],
                    elemento : datos["Tienda"][i]["elemento"],
                    precio : datos["Tienda"][i]["precio"],
                    descripcion : datos["Tienda"][i]["descripcion"]
                };
                
                tienda.push(objetoTiendaActual);
            }
            console.log("*** AJAX Tienda cargada ***"); // para debug
            console.log(tienda); // para debug
        }
      };

    xhttp.open("GET", "./php/ajaxCargarTienda.php?", true);
    xhttp.send();
    
}