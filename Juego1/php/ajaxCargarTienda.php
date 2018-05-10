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
                
            $consulta = "SELECT * FROM tObjetos;";
            $result = mysqli_query($conn, $consulta);
                    
            if ($result==TRUE){
                while ($fila2 = mysqli_fetch_array($result)) {
                    $textTienda .= "{
                    \"idObjeto\":\"$fila2[idObjeto]\",\"nombre\":\"$fila2[nombre]\",
                    \"tipo\":\"$fila2[tipo]\",\"aumenta\":\"$fila2[aumenta]\",
                    \"valor\":\"$fila2[valor]\",\"elemento\":\"$fila2[elemento]\",
                    \"precio\":\"$fila2[precio]\",\"descripcion\":\"$fila2[descripcion]\"},";
                }
                //QUITA EL ULTIMO CARACTER (,) PARA EVITAR ERRORES AL CONCATENAR
                $textTienda = substr($textTienda, 0, -1);
                
                echo "{\"Tienda\":[$textTienda]}";
            }
            else{
                # La siguiente función muestra el último error, en caso
                # de haberlo.
                echo mysqli_error($conn);
                die ("Hubo un error");
            }   


    
            mysqli_close($conn); 
                                     
        ?> 
