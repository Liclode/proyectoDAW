        <?php
        // Compruebe el resultado de ejecutar el script anterior en la consola de mysql:
        // SELECT * FROM clientes;
        
            $servidor = "localhost";
            $username = "miusuario";
            $password = "mipassword";
            $basedatos = "bdjuego";

            # Crear conexión
            $conn = mysqli_connect($servidor, $username, $password, $basedatos);

            # Comprobar conexión
            if (!$conn) {
                die("Conexi&ocacuten fallida: " . mysqli_connect_error());
            }
            // mysqli_num_rows($result3) > 0 
            
                $nombreUsuario = $_GET['nombreUsuario'];
                $passUsuario = $_GET['passUsuario'];
                $imgAspecto = "img/cloud2.png";
                
                //COINCIDA USUARIO Y PASS
                $consulta2 = "SELECT * FROM tUsuarios WHERE nombre='".$nombreUsuario."' AND pass='".$passUsuario."';";
                $result2 = mysqli_query($conn, $consulta2);
                
                if(mysqli_num_rows($result2) == 0){
                    //no existe
                    echo 0;
                }
                else{
                    //ya existe
                    $textEquipo = "";
                    //$consulta = "SELECT * FROM Equipos WHERE Usuario='".$nombreUsuario."';";
                    
                    $consulta = "SELECT tObjetos.nombre, tObjetos.tipo, tObjetos.aumenta, tObjetos.valor, tObjetos.elemento, tObjetos.precio, tObjetos.descripcion, tInventarios.equipado
                    FROM tInventarios 
                    INNER JOIN tObjetos ON tInventarios.idObjeto = tObjetos.idObjeto 
                    INNER JOIN tUsuarios ON tInventarios.idUsuario = tUsuarios.idUsuario 
                    WHERE tUsuarios.nombre='".$nombreUsuario."';";
                    
                    $result = mysqli_query($conn, $consulta);
                    
                    if(mysqli_num_rows($result) != 0){
                        //CONCATENA TODOS LOS EQUIPOS Y LOS METE EN UN ARRAY (JSON)
                        while ($fila2 = mysqli_fetch_array($result)) {
                            $textEquipo .= "{\"nombreEquipo\":\"$fila2[nombre]\",\"tipo\":\"$fila2[tipo]\",\"aumenta\":\"$fila2[aumenta]\",\"valor\":\"$fila2[valor]\",\"elemento\":\"$fila2[elemento]\",\"precio\":\"$fila2[precio]\",\"descripcion\":\"$fila2[descripcion]\",\"equipado\":\"$fila2[equipado]\"},";
                        }
                        //QUITA EL ULTIMO CARACTER (,) PARA EVITAR ERRORES AL CONCATENAR
                        $textEquipo = substr($textEquipo, 0, -1);
                    }
                    
                    while ($fila = mysqli_fetch_array($result2)) {
                        echo "{\"Nombre\":\"$fila[nombre]\",\"Pass\":\"$fila[pass]\",
                        \"Ataque\":\"$fila[ataque]\",\"Defensa\":\"$fila[defensa]\",
                        \"Especial\":\"$fila[especial]\",\"Vida\":\"$fila[vida]\",
                        \"VidaMAX\":\"$fila[vidaMax]\",\"Exp\":\"$fila[exp]\",
                        \"ExpMAX\":\"$fila[expMax]\",\"Nivel\":\"$fila[nivel]\",
                        \"PuntosDisponibles\":\"$fila[puntosDisponibles]\",
                        \"Dinero\":\"$fila[dinero]\",\"Aspecto\":\"$fila[aspecto]\",
                        \"Equipo\":[$textEquipo],\"MisionActual\":\"$fila[misionActual]\"}";
                        
                    }
                    // echo 1;
                }

    
            mysqli_close($conn); 
                                     
        ?> 
