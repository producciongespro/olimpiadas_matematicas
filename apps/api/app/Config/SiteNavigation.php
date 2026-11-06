<?php

namespace Config;

final class SiteNavigation
{
    public const HEADER = [
        'home_label' => 'OLCOMEP, inicio', 'slogan' => 'Matemática para Primaria',
        'links' => [
            ['key' => 'informacion', 'label' => 'Información', 'href' => '#preguntas-frecuentes'],
            ['key' => 'regionales', 'label' => 'Regionales', 'href' => '#coordinaciones-regionales'],
            ['key' => 'edicion', 'label' => 'Edición vigente', 'href' => '#edicion-vigente'],
            ['key' => 'practica', 'label' => 'Práctica', 'href' => '#cuadernillos'],
            ['key' => 'interactivos', 'label' => 'Interactivos', 'href' => '#interactivos'],
            ['key' => 'galeria', 'label' => 'Galería', 'href' => '#galeria'],
            ['key' => 'acerca', 'label' => 'Acerca', 'href' => '#acerca-de-nosotros'],
            ['key' => 'contacto', 'label' => 'Contacto', 'href' => '#contacto'],
        ],
    ];

    public static function headerForEdition(mixed $year): array
    {
        $year = filter_var($year, FILTER_VALIDATE_INT, ['options' => ['min_range' => 2000, 'max_range' => 2100]]);
        $header = self::HEADER;
        if ($year === false) return $header;

        foreach ($header['links'] as &$link) {
            if ($link['key'] === 'edicion') {
                $link['label'] = "Edición {$year}";
                break;
            }
        }
        return $header;
    }
}
