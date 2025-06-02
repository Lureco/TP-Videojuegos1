class Persona extends Entidad {
    constructor(x, y, juego) {
        super(x, y, juego);
        this.nombre = "Persona";
        var listaDeCompra = []       //luchito
        var carrito = []         //luchito
        this.spritesAnimados = {};
        this.crearContainer();
    }

    crearContainer() {
        super.crearContainer();
        this.container.interactive = true;
        this.container.on("pointerdown", (e) => {
            console.log("click en", this);
        });
    }

   
    crearProducto(){
      productoBuscado = Math.floor(Math.random() * 6) // segun el numero elige un prducto al azar, si mas pobre el local
      
      if(productoBuscado == 0) {
        return leche
      }
      else if (productoBuscado == 1){
        return arroz
      }
      else if (productoBuscado == 2){
        return huevos
      }
      else if (productoBuscado == 3){   //version de donde me da la cabecita
        return pan
      }
      else if (productoBuscado == 4){
        return agua
      }
       else if (productoBuscado == 5){
        return carne
      }

    //  }crearProducto() {
    //let productoBuscado = Math.floor(Math.random() * 5); // 0-4
    
    //if (productoBuscado == 0) {
    //    return { id: Date.now(), nombre: "Manzana", precio: 2.50, categoria: "Fruta" };
    //} else if (productoBuscado == 1) {
      //  return { id: Date.now(), nombre: "Pan", precio: 1.20, categoria: "Panadería" };
   // } else if (productoBuscado == 2) {                                                     version por si le ponemos precios
     //   return { id: Date.now(), nombre: "Leche", precio: 3.00, categoria: "Lácteos" };
    //} else if (productoBuscado == 3) {
     //   return { id: Date.now(), nombre: "Arroz", precio: 4.50, categoria: "Cereales" };
    //} else {
      //  return { id: Date.now(), nombre: "Huevos", precio: 2.80, categoria: "Proteínas" };
    //}
}
    

    agregarALista(){
     let cantidadDeProductos =  Math.floor(Math.random() * 15) + 1
     let i = 0
       if (i < cantidadDeProductos){
        this.listaDeCompra.push(this.crearProducto())
        i++
       }
    }

    

    comprarProducto(producto){ //luchito
        this.carrito.push(producto)

    }


    update() {
        super.update();
    }

    render() {
        super.render();
    }

    // async cargarSpritesAnimados() {
    //     //cargo el json
    //     let json = await PIXI.Assets.load("texture.json");

    //     //recorro todas las animaciones q tiene
    //     for (let animacion of Object.keys(json.animations)) {
    //         //cada animacion ahora esta en la variable animacion:
    //         //en el objeto spritesAnimados, creo q una propiedad/valor nuevo, con el nombre de la animacion, y le meto una nueva instancia de PIXI.animatedSprite
    //         this.spritesAnimados[animacion] = new PIXI.AnimatedSprite(
    //             json.animations[animacion]
    //         );

    //         //q loopee
    //         this.spritesAnimados[animacion].loop = true;
    //         //y le damos play
    //         this.spritesAnimados[animacion].play();
    //         //lo metemos en el container de esta entidad/persona
    //         this.container.addChild(this.spritesAnimados[animacion]);

    //         //el punto de anclaje abajo al medio (donde el chabon toca el piso, pq este punto lo usamos para ver quien esta adelante y quien esta atras)
    //         this.spritesAnimados[animacion].anchor.set(0.5, 1);
    //         //el frame inicial q sea random
    //         this.spritesAnimados[animacion].currentFrame = Math.floor(
    //             this.spritesAnimados[animacion].totalFrames * Math.random()
    //         );
    //     }

    //     this.cambiarDeSpriteSegunVelocidad();

    //     this.yaCargoElSprite = true;
    // }
}