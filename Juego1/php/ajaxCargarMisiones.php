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
                
            $consulta = "SELECT md.idMundo AS idMundo, md.nombre AS nombreMundo, ms.idMision AS idMision, ms.nombre AS nombreMision, ms.descripcion AS misionDes FROM tMundos md INNER JOIN tMisiones ms ON md.idMundo = ms.mundoPertenece;";
            $result = mysqli_query($conn, $consulta);
                    
            if ($result==TRUE){
                while ($fila2 = mysqli_fetch_array($result)) {
                    $textMision .= "{\"idMundo\":\"$fila2[idMundo]\",\"nombreMundo\":\"$fila2[nombreMundo]\",\"idMision\":\"$fila2[idMision]\",\"nombreMision\":\"$fila2[nombreMision]\",\"misionDes\":\"$fila2[misionDes]\"},";
                }
                //QUITA EL ULTIMO CARACTER (,) PARA EVITAR ERRORES AL CONCATENAR
                $textMision = substr($textMision, 0, -1);
                
                echo "{\"Misiones\":[$textMision]}";
            }
            else{
                # La siguiente función muestra el último error, en caso
                # de haberlo.
                echo mysqli_error($conn);
                die ("Hubo un error");
            }   


    
            mysqli_close($conn); 
                                     
        ?> 
