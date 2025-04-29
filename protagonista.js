class Protagonista extends Persona {
    constructor(x, y, juego) {
        super(x, y, juego);

        this.container.name = "protagonista";
        
        var clickX = 0 // fue luchito
        var clickY = 0 // fue luchito
        this.container.tint = 0x0000ff;
        this.velocidadMaxima = 3;
        this.accMax = 0.33;
        this.valorFriccion = 0.95;
        this.SeEstaMoviendo = false ;
        this.cargarSpritesAnimados()
    }

    update() {
        if (this.muerta) return;

        this.moverseSegunTeclado();
        this.moverseSegunClick(); // lucho fue
        this.moverseHaciaElclick(); // lucho fue

        super.update();

        this.limitarPosicion();
    }
    moverseSegunClick(){ // fue lucho
        app.stage.eventMode = 'static';
        app.stage.hitArea = app.screen;  // lee los click en pantalla
        app.stage.on('pointerdown', (event) => { // Establece el lugar dopndefue el click
            clickX = event.global.x;
            clickY = event.global.y;
            SeEstaMoviendo = true;
        });
    }

    moverseHaciaElclick(){ // tmb fui yo 
        app.ticker.add(() => { // actualiza la pos del prota en  cada frame
            if (SeEstaMoviendo) {
                //calcula  la direccion y deistancia al click
                const dx = clickX - this.x; 
                const dy = clickY - this.y;
                const distancia = Math.sqrt(dx * dx + dy * dy);
                // si estamos cerca del objetivo detiene el movimiento
                if (distancia < this.velocidadMaxima){
                    this.x = clickX
                    this.y = clickY
                    this.SeEstaMoviendo = false ;
                }
                else
                // ubica al pj hacia el objetivo
                this.x += (dx / distancia) * this.velocidadMaxima
                this.y += (dy / distancia) * this.velocidadMaxima
            }
            })
    }
       
     

        
    
    moverseSegunTeclado() {
        let accX = 0;
        let accY = 0;

        // Detectar teclas presionadas
        if (this.juego.teclado.w) accY = -1;
        if (this.juego.teclado.s) accY = 1;
        if (this.juego.teclado.a) accX = -1;
        if (this.juego.teclado.d) accX = 1;

        if (accX !== 0 && accY !== 0) {
            // Si nos movemos en diagonal, normalizar el vector
            accX *= 0.707;
            accY *= 0.707;
        }

        this.aplicarAceleracion(accX, accY);
    }

    limitarPosicion() {
        if (!this.juego.fondo) return;
        if (this.x > this.juego.fondo.width) {
            this.x = this.juego.fondo.width;
            this.velX = 0;
        }
    }

    async cargarSpritesAnimados() {
        //cargo el json
        let texture = await PIXI.Assets.load("idle.png");

        this.sprite = new PIXI.Sprite(texture)
        this.container.addChild(this.sprite)
        this.sprite.scale.set(2);
        this.sprite.x = 100
        this.sprite.y = 100
        this.sprite.anchor.set(0.5, 1)
    }
}