class Sockets {
    constructor( io ) {

        this.io = io;

        this.socketEvents();
    }

    socketEvents() {
        console.log('socketEvents');
    }
}

export default Sockets;