class Juego {
    constructor() {
        this.app = new PIXI.Application();
        this.contadorDeFrame = 0;
        this.ancho = window.innerWidth;
        this.alto = window.innerHeight;

        this.mouse = { x: 0, y: 0 };

        this.teclado = {};

        this.gravedad = { x: 0, y: 3 };

        this.personas = [];

        this.containerUI = null;         // Contenedor para la interfaz de usuario
        this.menuActual = null;              // Menú actualmente abierto
          
        this.panelEstadisticas = null;
        this.estadisticas = {
            dinero: 1000,
            clientes: 5,
            empleados: 2,
            tiempo: 0 // en segundos del juego
        };

        this.app
            .init({ width: this.ancho, height: this.alto, background: "#ffffff" })
            .then(() => {
                this.pixiListo();
            });
    }

    pixiListo() {
        console.log("pixi listo");

        document.body.appendChild(this.app.canvas);

        this.ponerEventListeners();

        window.__PIXI_APP__ = this.app;

        this.containerPrincipal = new PIXI.Container();
        this.containerPrincipal.name = "el container principal";
        this.app.stage.addChild(this.containerPrincipal);

        this.ponerFondo();
        this.ponerProtagonista();

        this.app.stage.sortableChildren = true;

        this.app.ticker.add(() => this.gameLoop());
    }

    gameLoop() {
        this.contadorDeFrame++;
        this.moverCamara();
        this.protagonista.update();
        ///renders
        this.protagonista.render();
    }

    async ponerFondo() {
        // Cargar la textura
        let textura = await PIXI.Assets.load("bg.png");

        // Crear el TilingSprite con la textura y dimensiones
        this.fondo = new PIXI.TilingSprite(textura, this.ancho * 3, this.alto * 3);

        // Añadir al escenario
        this.containerPrincipal.addChild(this.fondo);
    }

    ponerEventListeners() {
        window.onmousemove = (evento) => {
            this.cuandoSeMueveElMouse(evento);
        };

        window.onkeydown = (eventoTeclado) => {
            let letraApretada = eventoTeclado.key.toLowerCase();
            this.teclado[letraApretada] = true;
        };

        window.onkeyup = (eventoTeclado) => {
            let letraApretada = eventoTeclado.key.toLowerCase();
            delete this.teclado[letraApretada];
        };
    }

    cuandoSeMueveElMouse(evento) {
        this.mouse.x = evento.x;
        this.mouse.y = evento.y;
    }

    moverCamara() {
        if (!this.fondo) return;
        if (!this.protagonista) return;
        if (!this.containerPrincipal) return;
        // this.containerPrincipal.x = this.protagonista.x;
        // this.containerPrincipal.y = this.protagonista.y;

        const cuanto = 0.033333;

        const valorFinalX = -this.protagonista.x + this.ancho / 2;
        const valorFinalY = -this.protagonista.y + this.alto / 2;

        this.containerPrincipal.x -=
            (this.containerPrincipal.x - valorFinalX) * cuanto;
        this.containerPrincipal.y -=
            (this.containerPrincipal.y - valorFinalY) * cuanto;

        if (this.containerPrincipal.x > 0) this.containerPrincipal.x = 0;
        if (this.containerPrincipal.y > 0) this.containerPrincipal.y = 0;

        //limite derecho
        if (this.containerPrincipal.x < -this.fondo.width + this.ancho) {
            this.containerPrincipal.x = -this.fondo.width + this.ancho;
        }

        if (this.containerPrincipal.y < -this.fondo.height + this.alto) {
            this.containerPrincipal.y = -this.fondo.height + this.alto;
        }
    }

    ponerProtagonista() {
        this.protagonista = new Protagonista(500, 500, this);
        this.containerPrincipal.addChild(this.protagonista.container);
    }

    // SISTEMA DE BOTONES

    // Función para crear el fondo de un botón
    crearFondoBoton(ancho, alto, color, isHovered = false) {
        const fondo = new PIXI.Graphics();
        const fillColor = isHovered ? 0x2980b9 : color;
        fondo.beginFill(fillColor);
        fondo.drawRoundedRect(0, 0, ancho, alto, 8);
        fondo.endFill();
        return fondo;
    }

    // Función para crear el borde de un botón
    crearBordeBoton(ancho, alto) {
        const borde = new PIXI.Graphics();
        borde.lineStyle(2, 0x2980b9);
        borde.drawRoundedRect(0, 0, ancho, alto, 8);
        return borde;
    }

    // Función para crear el texto de un botón
    crearTextoBoton(texto, ancho, alto) {
        const textoBoton = new PIXI.Text(texto, {
            fontFamily: 'Arial',
            fontSize: 16,
            fill: 0xffffff,
            align: 'center',
            fontWeight: 'bold'
        });

        textoBoton.x = ancho / 2 - textoBoton.width / 2;
        textoBoton.y = alto / 2 - textoBoton.height / 2;

        return textoBoton;
    }



    // Función principal para crear un botón
    crearBoton(x, y, ancho, alto, texto, color = 0x3498db) {
        const button = new PIXI.Container();
        
        // Crear componentes del botón
        const fondo = this.crearFondoBoton(ancho, alto, color);
        const borde = this.crearBordeBoton(ancho, alto);
        const textoBoton = this.crearTextoBoton(texto, ancho, alto);

        // Ensamblar botón
        button.addChild(fondo, borde, textoBoton);
        button.x = x;
        button.y = y;
        
        // Hacer el botón interactivo
        button.interactive = true;
        button.buttonMode = true;
        
        return button;
    }
    
    // Función para crear el overlay de fondo de la modal
    crearOverlayMenuDesplegable() {
        const overlay = new PIXI.Graphics();
        overlay.beginFill(0x000000, 0.7);
        overlay.drawRect(0, 0, this.ancho, this.alto);
        overlay.endFill();
        overlay.interactive = true;
        return overlay;
    }

    // Función para crear el fondo de la ventana modal
    crearFondoMenuDesplegable() {
        const menuAncho = 400;
        const menuAlto = 300;
        const menuX = (this.ancho - menuAncho) / 2;
        const menuY = (this.alto - menuAlto) / 2;

        const fondoMenu = new PIXI.Graphics();
        fondoMenu.beginFill(0xffffff);
        fondoMenu.lineStyle(3, 0x34495e);
        fondoMenu.drawRoundedRect(menuX, menuY, menuAncho, menuAlto, 12);
        fondoMenu.endFill();

        return { menuBg, menuX, menuY, menuAncho, menuAlto };
    }

    // Función para crear el título de la modal
    crearTituloMenuDesplegable(title, menuX, menuY) {
        const titleText = new PIXI.Text(title, {
            fontFamily: 'Arial',
            fontSize: 24,
            fill: 0x2c3e50,
            fontWeight: 'bold'
        });
        titleText.x = menuX + 20;
        titleText.y = menuY + 20;
        return titleText;
    }

    // Función para crear el contenido de la modal
    crearContenidoMenuDesplegable(content, menuX, menuY, menuAncho) {
        const contentText = new PIXI.Text(content, {
            fontFamily: 'Arial',
            fontSize: 16,
            fill: 0x34495e,
            wordWrap: true,
            wordWrapWidth: menuAncho - 40
        });
        contentText.x = menuX + 20;
        contentText.y = menuY + 70;
        return contentText;
    }

    // Función para crear el botón de cerrar de la modal
    crearBotonCerrarMenuDesplegable(menuX, menuY, menuAncho, onClose) {
        const botonCierre = new PIXI.Graphics();
        botonCierre.beginFill(0xe74c3c);
        botonCierre.drawRoundedRect(menuX + menuAncho - 50, menuY + 10, 30, 30, 5);
        botonCierre.endFill();

        const textoCierre = new PIXI.Text('✕', {
            fontFamily: 'Arial',
            fontSize: 18,
            fill: 0xffffff,
            fontWeight: 'bold'
        });
        textoCierre.x = menuX + menuAncho - 42;
        textoCierre.y = menuY + 16;

        botonCierre.interactive = true;
        botonCierre.buttonMode = true;
        botonCierre.addChild(textoCierre);

        // Efectos hover del botón cerrar
        botonCierre.on('pointerover', () => {
            botonCierre.clear();
            botonCierre.beginFill(0xc0392b);
            botonCierre.drawRoundedRect(menuX + menuAncho - 50, menuY + 10, 30, 30, 5);
            botonCierre.endFill();
            botonCierre.addChild(textoCierre);
        });

        botonCierre.on('pointerout', () => {
            botonCierre.clear();
            botonCierre.beginFill(0xe74c3c);
            botonCierre.drawRoundedRect(menuX + menuAncho - 50, menuY + 10, 30, 30, 5);
            botonCierre.endFill();
            botonCierre.addChild(textoCierre);
        });

        botonCierre.on('pointerdown', onClose);

        return botonCierre;
    }

    // Función principal para crear ventana desplegable             
    crearDesplegable(titulo, contenido, alCerrar) {
        const menu = new PIXI.Container();
        
        // Crear componentes de la modal
        const overlay = this.crearOverlayMenuDesplegable();
        const { fondoMenu, menuX, menuY, menuAncho, menuAlto } = this.crearFondoMenuDesplegable();
        const titleText = this.crearTituloMenuDesplegable(titulo, menuX, menuY);
        const contentText = this.crearContenidoMenuDesplegable(contenido, menuX, menuY, menuAncho);
        const closeButton = this.crearBotonCerrarMenuDesplegable(menuX, menuY, menuAncho, alCerrar);

        // Cerrar al hacer click en el overlay
        overlay.on('pointerdown', onClose);

        // Ensamblar menu
        menu.addChild(overlay, fondoMenu, tituloDeTexto, contenidoDeTexto, botonCierre);

        return menu;
    }

    cerrarDesplegable() {
        if (this.menuActual) {
            this.containerUI.removeChild(this.menuActual);
            this.menuActual = null;
        }
    }

    // Función para mostrar modal de menú
    mostrarMenuDesplegable() {
        this.cerrarDesplegable();
        this.menuActual = this.crearDesplegable(
            'MENÚ PRINCIPAL',
            'Bienvenido al menú principal.\n\nAquí puedes encontrar:\n• Nuevo Juego\n• Cargar Partida\n• Configuración\n• Créditos\n\nSelecciona una opción para continuar.',
            () => this.cerrarDesplegable()
        );
        this.containerUI.addChild(this.menuActual);
    }

    // Función para mostrar modal de opciones
    mostrarOpcionesDesplegable() {
        this.cerrarDesplegable();
        this.menuActual = this.crearDesplegable(
            'GESTOR',
            'Cantidad de Chorros',
            () => this.cerrarDesplegable()
        );
        this.containerUI.addChild(this.menuActual);
    }

    // Función para crear los botones principales
    crearBotonesUI() {
        const boton1 = this.createButton(20, 20, 120, 40, 'MENÚ', 0x3498db);
        const boton2 = this.createButton(20, 80, 120, 40, 'GESTOR', 0x27ae60);

        // Asignar eventos
        boton1.on('pointerdown', () => this.mostrarMenuDesplegable());
        boton2.on('pointerdown', () => this.mostrarOpcionesDesplegable());

        // Agregar al container UI
        this.containerUI.addChild(boton1, boton2);

        // Guardar referencias si necesitas modificarlos después
        this.botonMenu = boton1;
        this.botonGestor = boton2;
    }
     


    // Función para crear el fondo del panel de estadísticas
    createPanelBackground(ancho, alto) {
        const fondo = new PIXI.Graphics();
        fondo.beginFill(0x2c3e50, 0.9); // Fondo semi-transparente
        fondo.lineStyle(2, 0x34495e);
        fondo.drawRoundedRect(0, 0, ancho, alto, 8);
        fondo.endFill();
        return fondo;
    }

   
    crearFilaEstadisticas(nombre, valor, y, ancho) {
        const container = new PIXI.Container();
        
      
        const labelText = new PIXI.Text(nombre + ':', {
            fontFamily: 'Arial',
            fontSize: 14,
            fill: 0xecf0f1,
            fontWeight: 'bold'
        });
        labelText.x = 10;
        labelText.y = y;
        
        // Texto del valor
        const valueText = new PIXI.Text(valor, {
            fontFamily: 'Arial',
            fontSize: 14,
            fill: 0xffffff
        });
        valueText.x = ancho - valueText.width - 10;
        valueText.y = y;
        
        container.addChild(labelText, valueText);
        container.valueText = valueText; // Guardar referencia para actualizaciones
        container.width = ancho;

        return container;
    }

    // Función para formatear el tiempo en MM:SS
    formatearTiempo(segundos) {
        const minutos = Math.floor(segundos / 60);
        const segs = segundos % 60;
        return `${minutos.toString().padStart(2, '0')}:${segs.toString().padStart(2, '0')}`;
    }

    // Función para formatear dinero
    formatearDinero(cantidad) {
        return `${cantidad.toLocaleString()}`;
    }

    // Función principal para crear el panel de estadísticas
    crearPanelEstadisticas() {
        const panelWidth = 180;
        const panelHeight = 120;
        
        this.panelEstadisticas = new PIXI.Container();
        
        // Fondo del panel
        const bg = this.createPanelBackground(panelWidth, panelHeight);
        this.panelEstadisticas.addChild(bg);
        
        // Título del panel
        const titulo = new PIXI.Text('ESTADO', {
            fontFamily: 'Arial',
            fontSize: 16,
            fill: 0xf1c40f,
            fontWeight: 'bold',
            align: 'center'
        });
        titulo.x = panelWidth / 2 - titulo.width / 2;
        titulo.y = 8;
        this.panelEstadisticas.addChild(titulo);
        
        // Crear filas de estadísticas
        this.filaDinero = this.createStatRow('Dinero', this.formatearDinero(this.estadisticas.dinero), 35, panelWidth);
        this.filaClientes = this.createStatRow('Clientes', this.estadisticas.clientes.toString(), 55, panelWidth);
        this.filaEmpleados = this.createStatRow('Empleados', this.estadisticas.empleados.toString(), 75, panelWidth);
        this.filaTiempo = this.createStatRow('Tiempo', this.formatearTiempo(this.estadisticas.tiempo), 95, panelWidth);
        
        // Agregar filas al panel
        this.panelEstadisticas.addChild(this.filaDinero);
        this.panelEstadisticas.addChild(this.filaClientes);
        this.panelEstadisticas.addChild(this.filaEmpleados);
        this.panelEstadisticas.addChild(this.filaTiempo);
        
        // Posicionar el panel
        this.posicionarPanelEstadisticas();
        
        // Agregar al container UI
        this.containerUI.addChild(this.panelEstadisticas);
    }

    // Función para posicionar el panel en la esquina superior derecha
    posicionarPanelEstadisticas() {
        if (!this.panelEstadisticas) return;
        this.panelEstadisticas.x = this.ancho - 200; // 20px desde el borde derecho
        this.panelEstadisticas.y = 20;
    }

    // Función para actualizar el tiempo del juego
    actualizarTiempo() {
        // Incrementar tiempo cada 60 frames (aproximadamente 1 segundo a 60fps)
        if (this.contadorDeFrame % 60 === 0) {
            this.estadisticas.tiempo++;
        }
    }

    // Función para actualizar las estadísticas en pantalla
    actualizarPanelEstadisticas() {
        if (!this.panelEstadisticas) return;
        
        // Actualizar texto de dinero
        this.filaDinero.valueText.text = this.formatearDinero(this.estadisticas.dinero);
        this.filaDinero.valueText.x = 180 - this.filaDinero.valueText.width - 10;
        
        // Actualizar texto de clientes
        this.filaClientes.valueText.text = this.estadisticas.clientes.toString();
        this.filaClientes.valueText.x = 180 - this.filaClientes.valueText.width - 10;
        
        // Actualizar texto de empleados
        this.filaEmpleados.valueText.text = this.estadisticas.empleados.toString();
        this.filaEmpleados.valueText.x = 180 - this.filaEmpleados.valueText.width - 10;
        
        // Actualizar texto de tiempo
        this.filaTiempo.valueText.text = this.formatearTiempo(this.estadisticas.tiempo);
        this.filaTiempo.valueText.x = 180 - this.filaTiempo.valueText.width - 10;
    }

    // Métodos para modificar estadísticas (puedes llamar estos desde tu juego)
    agregarDinero(cantidad) {
        this.estadisticas.dinero += cantidad;
    }

    restarDinero(cantidad) {
        this.estadisticas.dinero = Math.max(0, this.estadisticas.dinero - cantidad);
    }

    cambiarClientes(cantidad) {
        this.estadisticas.clientes = Math.max(0, cantidad);
    }

    cambiarEmpleados(cantidad) {
        this.estadisticas.empleados = Math.max(0, cantidad);
    }
}