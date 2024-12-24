<!DOCTYPE html>
<html lang="id">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Perintah Suara dengan Regex</title>

    <link href="{{ asset('css/style.css') }}" rel="stylesheet">

    <meta name="csrf-token" content="{{ csrf_token() }}">

    <script src="{{ asset('js/voiceCommand.js') }}" defer></script>
</head>

<body>
    <div class="container">
        <h1>Perintah Suara dengan Regex</h1>

        <textarea id="voiceInput" rows="5" cols="50" placeholder="Katakan sesuatu..."></textarea><br><br>

        <button onclick="startRecognition()">Mulai Merekam</button>
        <button onclick="stopRecognition()">Hentikan Merekam</button><br><br>

        <button onclick="submitCommand()">Kirim Perintah</button>

        <!-- Card untuk menampilkan pesan -->
        <div id="messageCard" class="message-card" style="display: none;">
            <div id="cardContent"></div>
        </div>
    </div>
</body>

</html>