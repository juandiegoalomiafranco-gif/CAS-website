# Cómo subir tus fotos y vídeos

No hay que tocar nada de código. **Sube el archivo a su carpeta con el nombre
exacto que aparece abajo y aparece solo en la página.**

Mientras un archivo no exista, se ve un marco vacío con su etiqueta. La página
nunca se rompe ni muestra imágenes rotas.

---

## Cómo subirlas desde GitHub (sin instalar nada)

1. Entra a <https://github.com/juandiegoalomiafranco-gif/CAS-website>
2. Arriba a la izquierda, asegúrate de estar en la rama correcta
3. Navega hasta la carpeta, por ejemplo
   `CAS pagina web/images/proyectos/bateria/`
4. Botón **Add file → Upload files**
5. Arrastra tus fotos o vídeos
6. **Importante:** renómbralos antes de subirlos (`01.jpg`, `02.jpg`… para las
   fotos; `video-01.mp4`, `video-02.mp4`… para los vídeos)
7. Abajo, **Commit changes**

---

## Formato de las fotos

- **Verticales** (las del celular van perfectas). La rejilla está pensada para
  vertical 3:4, y admite también 9:16 y alguna horizontal sin descuadrarse.
- **`.jpg`** en minúscula. Si tu foto es `.png` o `.HEIC`, conviértela primero.
- Ideal entre **1200 y 2000 px** de ancho. Más grande solo hace la página lenta.

## Formato de los vídeos

- **`.mp4`** en minúscula. Es el único formato que reproducen todos los
  navegadores. Si grabaste con iPhone tendrás un `.mov`: compártelo por
  WhatsApp o Drive, o expórtalo desde Fotos, y sale en `.mp4`.
- La página también intenta `.webm` y `.mov` con el mismo nombre, pero un
  `.mov` de iPhone no se ve en Chrome ni en Android. Con `.mp4` no hay dudas.
- **Menos de 25 MB** por vídeo. GitHub no acepta archivos de más de 100 MB, y
  un vídeo pesado hace que la página tarde en cargar. Recorta el clip a los
  segundos que de verdad quieres mostrar.
- Vertical y horizontal funcionan los dos. El marco se adapta a lo que subas.

---

## Dónde va cada foto

### Quién Soy → `images/quien-soy/`
La galería que acompaña tu biografía. **6 fotos:** `01.jpg` … `06.jpg`

| Archivo | Aparece como |
|---|---|
| `01.jpg` | Música |
| `02.jpg` | Natación |
| `03.jpg` | Running |
| `04.jpg` | Bajo |
| `05.jpg` | Colegio |
| `06.jpg` | Servicio |

> Para cambiar esas etiquetas, edita el `<figcaption>` de cada foto en
> `quien-soy.html`. Y actualiza el `data-alt` con una descripción real
> (importante para accesibilidad y para el SEO).

### Proyectos → `images/proyectos/<proyecto>/`

Carpetas disponibles: `bateria`, `bajo`, `piano`, `natacion`, `running`,
`triatlon`, `impacto-social`, `proyecto-cas`

Cada una acepta:

- **4 fotos destacadas:** `destacada-01.jpg` … `destacada-04.jpg`
  Son las que salen grandes en la banda que se desplaza a lo ancho.
- **9 evidencias:** `01.jpg` … `09.jpg`
  Son la galería del final, con visor a pantalla completa al hacer clic.

### Experiencias → `images/experiencias/exp-0N/`

Cada experiencia tiene su carpeta, con huecos para fotos y para vídeos.

| Carpeta | Experiencia | Fotos | Vídeos |
|---|---|---|---|
| `exp-01` | Concierto en el Teatro Municipal | `01.jpg` … `06.jpg` | `video-01.mp4` … `video-03.mp4` |

**Enlace directo para subir los archivos del Teatro Municipal:**
<https://github.com/juandiegoalomiafranco-gif/CAS-website/upload/main/CAS%20pagina%20web/images/experiencias/exp-01>

Ese mismo enlace sirve para las fotos y para los vídeos: los dos van a la
misma carpeta y la página los coloca en su sección según el nombre del archivo.

Al crear una experiencia nueva, su carpeta se llama `exp-02`, `exp-03`, y así.

---

## Si quieres más (o menos) fotos en una galería

En el HTML de esa página, cada hueco es un bloque como este:

```html
<figure class="mosaic__item" data-slot="images/proyectos/bateria/10.jpg"
        data-alt="Batería — evidencia 10" data-cap="Evidencia 10">
  <div class="placeholder-img">
    <span class="eyebrow">Foto 10</span>
    <span class="placeholder-img__note">10.jpg</span>
  </div>
</figure>
```

Copia y pega el bloque cambiando el número para añadir uno; bórralo para quitarlo.

Para controlar la proporción de un hueco:

| Clase | Proporción |
|---|---|
| `mosaic__item` | vertical 3:4 *(por defecto)* |
| `mosaic__item mosaic__item--tall` | vertical largo 9:16 |
| `mosaic__item mosaic__item--land` | horizontal 3:2 |

## Si quieres más (o menos) vídeos

Funciona igual, con `data-video-slot` en vez de `data-slot`:

```html
<figure class="vidslot vidslot--tall"
        data-video-slot="images/experiencias/exp-01/video-04.mp4"
        data-alt="Concierto — vídeo 04" data-cap="Vídeo 04">
  <div class="placeholder-img">
    <span class="eyebrow">Vídeo 04</span>
    <span class="placeholder-img__note">video-04.mp4</span>
  </div>
</figure>
```

| Clase | Marco vacío |
|---|---|
| `vidslot` | horizontal 16:9 *(por defecto)* |
| `vidslot vidslot--tall` | vertical 9:16 *(vídeo de celular)* |

El marco solo fija el hueco mientras no hay archivo. Una vez subes el vídeo,
manda su proporción real.
