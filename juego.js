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
    createButtonBackground(width, height, color, isHovered = false) {
        const bg = new PIXI.Graphics();
        const fillColor = isHovered ? 0x2980b9 : color;
        bg.beginFill(fillColor);
        bg.drawRoundedRect(0, 0, width, height, 8);
        bg.endFill();
        return bg;
    }

    // Función para crear el borde de un botón
    createButtonBorder(width, height) {
        const border = new PIXI.Graphics();
        border.lineStyle(2, 0x2980b9);
        border.drawRoundedRect(0, 0, width, height, 8);
        return border;
    }

    // Función para crear el texto de un botón
    createButtonText(text, width, height) {
        const buttonText = new PIXI.Text(text, {
            fontFamily: 'Arial',
            fontSize: 16,
            fill: 0xffffff,
            align: 'center',
            fontWeight: 'bold'
        });
        
        buttonText.x = width / 2 - buttonText.width / 2;
        buttonText.y = height / 2 - buttonText.height / 2;
        
        return buttonText;
    }



    // Función principal para crear un botón
    createButton(x, y, width, height, text, color = 0x3498db) {
        const button = new PIXI.Container();
        
        // Crear componentes del botón
        const bg = this.createButtonBackground(width, height, color);
        const border = this.createButtonBorder(width, height);
        const buttonText = this.createButtonText(text, width, height);
        
        // Ensamblar botón
        button.addChild(bg, border, buttonText);
        button.x = x;
        button.y = y;
        
        // Hacer el botón interactivo
        button.interactive = true;
        button.buttonMode = true;
        
        return button;
    }

    // Función para crear el overlay de fondo de la modal
    createModalOverlay() {
        const overlay = new PIXI.Graphics();
        overlay.beginFill(0x000000, 0.7);
        overlay.drawRect(0, 0, this.ancho, this.alto);
        overlay.endFill();
        overlay.interactive = true;
        return overlay;
    }

    // Función para crear el fondo de la ventana modal
    createModalBackground() {
        const modalWidth = 400;
        const modalHeight = 300;
        const modalX = (this.ancho - modalWidth) / 2;
        const modalY = (this.alto - modalHeight) / 2;
        
        const modalBg = new PIXI.Graphics();
        modalBg.beginFill(0xffffff);
        modalBg.lineStyle(3, 0x34495e);
        modalBg.drawRoundedRect(modalX, modalY, modalWidth, modalHeight, 12);
        modalBg.endFill();
        
        return { modalBg, modalX, modalY, modalWidth, modalHeight };
    }

    // Función para crear el título de la modal
    createModalTitle(title, modalX, modalY) {
        const titleText = new PIXI.Text(title, {
            fontFamily: 'Arial',
            fontSize: 24,
            fill: 0x2c3e50,
            fontWeight: 'bold'
        });
        titleText.x = modalX + 20;
        titleText.y = modalY + 20;
        return titleText;
    }

    // Función para crear el contenido de la modal
    createModalContent(content, modalX, modalY, modalWidth) {
        const contentText = new PIXI.Text(content, {
            fontFamily: 'Arial',
            fontSize: 16,
            fill: 0x34495e,
            wordWrap: true,
            wordWrapWidth: modalWidth - 40
        });
        contentText.x = modalX + 20;
        contentText.y = modalY + 70;
        return contentText;
    }

    // Función para crear el botón de cerrar de la modal
    createModalCloseButton(modalX, modalY, modalWidth, onClose) {
        const closeButton = new PIXI.Graphics();
        closeButton.beginFill(0xe74c3c);
        closeButton.drawRoundedRect(modalX + modalWidth - 50, modalY + 10, 30, 30, 5);
        closeButton.endFill();
        
        const closeText = new PIXI.Text('✕', {
            fontFamily: 'Arial',
            fontSize: 18,
            fill: 0xffffff,
            fontWeight: 'bold'
        });
        closeText.x = modalX + modalWidth - 42;
        closeText.y = modalY + 16;
        
        closeButton.interactive = true;
        closeButton.buttonMode = true;
        closeButton.addChild(closeText);
        
        // Efectos hover del botón cerrar
        closeButton.on('pointerover', () => {
            closeButton.clear();
            closeButton.beginFill(0xc0392b);
            closeButton.drawRoundedRect(modalX + modalWidth - 50, modalY + 10, 30, 30, 5);
            closeButton.endFill();
            closeButton.addChild(closeText);
        });
        
        closeButton.on('pointerout', () => {
            closeButton.clear();
            closeButton.beginFill(0xe74c3c);
            closeButton.drawRoundedRect(modalX + modalWidth - 50, modalY + 10, 30, 30, 5);
            closeButton.endFill();
            closeButton.addChild(closeText);
        });
        
        closeButton.on('pointerdown', onClose);
        
        return closeButton;
    }

    // Función principal para crear ventana desplegable
    createModal(title, content, onClose) {
        const modal = new PIXI.Container();
        
        // Crear componentes de la modal
        const overlay = this.createModalOverlay();
        const { modalBg, modalX, modalY, modalWidth, modalHeight } = this.createModalBackground();
        const titleText = this.createModalTitle(title, modalX, modalY);
        const contentText = this.createModalContent(content, modalX, modalY, modalWidth);
        const closeButton = this.createModalCloseButton(modalX, modalY, modalWidth, onClose);
        
        // Cerrar al hacer click en el overlay
        overlay.on('pointerdown', onClose);
        
        // Ensamblar modal
        modal.addChild(overlay, modalBg, titleText, contentText, closeButton);
        
        return modal;
    }

    // Función para cerrar modal activa
    closeModal() {
        if (this.currentModal) {
            this.containerUI.removeChild(this.currentModal);
            this.currentModal = null;
        }
    }

    // Función para mostrar modal de menú
    showMenuModal() {
        this.closeModal();
        this.currentModal = this.createModal(
            'MENÚ PRINCIPAL',
            'Bienvenido al menú principal.\n\nAquí puedes encontrar:\n• Nuevo Juego\n• Cargar Partida\n• Configuración\n• Créditos\n\nSelecciona una opción para continuar.',
            () => this.closeModal()
        );
        this.containerUI.addChild(this.currentModal);
    }

    // Función para mostrar modal de opciones
    showOptionsModal() {
        this.closeModal();
        this.currentModal = this.createModal(
            'OPCIONES',
            'Panel de configuración del juego.\n\nOpciones disponibles:\n• Volumen: 80%\n• Resolución: 1920x1080\n• Modo Pantalla: Ventana\n• Controles: Teclado\n• Idioma: Español\n\nAjusta la configuración según tus preferencias.',
            () => this.closeModal()
        );
        this.containerUI.addChild(this.currentModal);
    }

    // Función para crear los botones principales
    crearBotonesUI() {
        const button1 = this.createButton(20, 20, 120, 40, 'MENÚ', 0x3498db);
        const button2 = this.createButton(20, 80, 120, 40, 'OPCIONES', 0x27ae60);

        // Asignar eventos
        button1.on('pointerdown', () => this.showMenuModal());
        button2.on('pointerdown', () => this.showOptionsModal());

        // Agregar al container UI
        this.containerUI.addChild(button1, button2);
        
        // Guardar referencias si necesitas modificarlos después
        this.botonMenu = button1;
        this.botonOpciones = button2;
    }

}