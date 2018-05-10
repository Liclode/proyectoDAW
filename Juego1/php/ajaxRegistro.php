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
                
                $consulta2 = "SELECT * FROM tUsuarios WHERE nombre='".$nombreUsuario."';";
                $result2 = mysqli_query($conn, $consulta2);
                
                if(mysqli_num_rows($result2) == 0){
                    $consulta = "INSERT INTO tUsuarios VALUES ('','".$nombreUsuario."','".$passUsuario."',10,5,5,100,100,0,100,1,5,'".$imgAspecto."',100,1);";
                    $result = mysqli_query($conn, $consulta);
                    
                    if ($result==TRUE)
                        //echo "$nombreUsuario,$passUsuario,10,5,5,100,100,0,100,1,5,$imgAspecto,100,1";
                        echo "{\"Nombre\":\"$nombreUsuario\",\"Pass\":\"$passUsuario\",
                        \"Ataque\":\"10\",\"Defensa\":\"5\",
                        \"Especial\":\"5\",\"Vida\":\"100\",
                        \"VidaMAX\":\"100\",\"Exp\":\"0\",
                        \"ExpMAX\":\"100\",\"Nivel\":\"1\",
                        \"PuntosDisponibles\":\"5\",
                        \"Aspecto\":\"$imgAspecto\",\"Dinero\":\"100\",
                        \"Equipo\":[],\"MisionActual\":\"1\"}";
                    else
                    {
                        # La siguiente función muestra el último error, en caso
                        # de haberlo.
                        echo mysqli_error($conn);
                        die ("Hubo un error");
                    }   
                }
                else{
                    //ya existe
                    echo 0;
                }

    
            mysqli_close($conn); 
                                     
        ?> 
