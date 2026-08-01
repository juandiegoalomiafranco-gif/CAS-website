# Cómo subir tus fotos

No hay que tocar nada de código. **Sube el archivo a su carpeta con el nombre
exacto que aparece abajo y la foto aparece sola en la página.**

Mientras un archivo no exista, se ve un marco vacío con su etiqueta — la página
nunca se rompe ni muestra imágenes rotas.

---

## Cómo subirlas desde GitHub (sin instalar nada)

1. Entra a <https://github.com/juandiegoalomiafranco-gif/CAS-website>
2. Arriba a la izquierda, asegúrate de estar en la rama correcta
3. Navega hasta la carpeta, por ejemplo
   `CAS pagina web/images/proyectos/bateria/`
4. Botón **Add file → Upload files**
5. Arrastra tus fotos
6. **Importante:** renómbralas a `01.jpg`, `02.jpg`, `03.jpg`… antes de subirlas
7. Abajo, **Commit changes**

---

## Formato de las fotos

- **Verticales** (las del celular van perfectas). La rejilla está pensada para
  vertical 3:4, y admite también 9:16 y alguna horizontal sin descuadrarse.
- **`.jpg`** en minúscula. Si tu foto es `.png` o `.HEIC`, conviértela primero.
- Ideal entre **1200 y 2000 px** de ancho. Más grande solo hace la página lenta.

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

Carpetas: `exp-01` … `exp-05`

- **6 fotos:** `01.jpg` … `06.jpg`

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
