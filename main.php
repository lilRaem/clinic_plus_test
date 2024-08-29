<?php
$env = parse_ini_file('.env');

$servername = $env["DB_SERVERNAME"];
$username = $env["DB_USERNAME"];
$password = $env["DB_PASSWORD"];
$dbname = $env["DB_NAME"];


$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$name = $_POST['name'];
$email = $_POST['email'];
$phone = $_POST['phone'];


if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo "Некорректный email";
    exit;
}

if (strlen($phone) < 10) {
    echo "Некорректный телефон";
    exit;
}

// Проверка на дублирование
$sql = "SELECT * FROM users WHERE name='$name' AND email='$email' AND phone='$phone' AND timestamp > NOW() - INTERVAL 5 MINUTE";
$result = $conn->query($sql);

if ($result->num_rows > 0) {
    echo json_encode('{"status":"Форма успешно отправлена"}');
} else {
    try{
        $sql = "INSERT INTO users (name, email, phone) VALUES ('$name', '$email', '$phone')";
        if ($conn->query($sql) === TRUE) {
            echo json_encode('{"status":"Форма успешно отправлена"}');
        } else {
            echo json_encode('{"status":"Ошибка: " '. $sql . "<br>" . $conn->error .'}');
        }
    } catch (Exception $e) {
        $result['status'] = 'error';
        $result['message'] = $e->getMessage();
        echo json_encode('{"status":"Ошибка: " '. $sql . "<br>" . $conn->error .'}');
    }

}
// echo json_encode($result);
$conn->close();
?>