<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class VoiceCommandController extends Controller
{
    public function processCommand(Request $request)
    {
        $command = $request->input('command');

        // Menambahkan beberapa pola regex untuk mengenali perintah suara
        $patterns = [
            '/(nyalakan|hidupkan|turn\s*on)\s*(lampu|lampunya?)/i' => 'Lampu telah dinyalakan.',
            '/(matikan|matikanlah|turn\s*off)\s*(lampu|lampunya?)/i' => 'Lampu telah dimatikan.',
            '/(siapa\s*namamu|siapa\s*kamu|siapa\s*audi)/i' => 'Saya adalah Nanta Ganteng.',
            '/musim\s*salju/i' => 'Efek salju telah diaktifkan.',
            '/hentikan\s*musim\s*salju/i' => 'Efek salju telah dihentikan.',
            '/buka\s*(facebook|youtube|google|twitter|instagram)/i' => 'Membuka situs web sekarang.',
        ];

        // URLs untuk situs yang dikenali
        $urls = [
            'facebook' => 'https://www.facebook.com',
            'youtube' => 'https://www.youtube.com',
            'google' => 'https://www.google.com',
            'twitter' => 'https://twitter.com',
            'instagram' => 'https://www.instagram.com',
        ];

        $responseMessage = 'Maaf, saya tidak mengerti perintah itu.';
        $effect = null;
        $url = null;

        // Mengecek apakah ada perintah yang cocok dengan pola regex
        foreach ($patterns as $pattern => $message) {
            if (preg_match($pattern, $command)) {

                if (preg_match('/musim\s*salju/i', $command)) {
                    return response()->json([
                        'message' => $message,
                        'effect' => 'snowfall',
                    ]);
                }

                if (preg_match('/hentikan\s*musim\s*salju/i', $command)) {
                    return response()->json([
                        'message' => $message,
                        'effect' => 'stop_snowfall',
                    ]);
                }

                // Cek jika perintah untuk membuka situs web
                if (preg_match('/buka\s*(facebook|youtube|google|twitter|instagram)/i', $command, $matches)) {
                    $site = strtolower($matches[1]);
                    if (array_key_exists($site, $urls)) {
                        $url = $urls[$site];
                        return response()->json([
                            'message' => "Membuka $site: " . $url,
                            'url' => $url,
                        ]);
                    }
                }
                $responseMessage = $message;
                break;
            }
        }

        return response()->json([
            'message' => $responseMessage,
            'effect' => $effect,
            'url' => $url
        ]);
    }
}
