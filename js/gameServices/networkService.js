class NetworkService {
    constructor() {
        this.socket = null,
        this.isConnected = false,
        this.reconnectInterval = null,
        this.serverURL = 'wss://pine.candl.pro/ws/testsocket/?token=48bc00a816650d065fef08fcd45d2c1d11b63e5e'
        this.events = new Phaser.Events.EventEmitter()
    }

    connect() {
        this.socket = new WebSocket(this.serverURL)

        this.socket.onopen = () =>{

            console.log("WebSocket Connection Successful")
            this.isConnected = true
            clearInterval(this.reconnectInterval)
        }

        this.socket.onclose = (event) =>{
            console.log('WebSocket connection closed');
            this.isConnected = false

            switch(event.code) {
                case 1000:
                    console.log("Normal closure - connection successfully completed");
                    break;
                case 1001:
                    console.log("Remote endpoint going away");
                    break;
                case 1002:
                    console.log("Protocol error");
                    break;
                case 1003:
                    console.log("Unsupported data");
                    break;
                case 1005:
                    console.log("No status received");
                    break;
                case 1006:
                    console.log("Abnormal closure - connection terminated unexpectedly");
                    break;
                case 1007:
                    console.log("Invalid frame payload data");
                    break;
                case 1008:
                    console.log("Policy violation");
                    break;
                case 1009:
                    console.log("Message too big");
                    break;
                case 1010:
                    console.log("Missing extension");
                    break;
                case 1011:
                    console.log("Internal server error");
                    break;
                case 1012:
                    console.log("Service restart");
                    break;
                case 1013:
                    console.log("Try again later");
                    break;
                case 1014:
                    console.log("Bad gateway");
                    break;
                case 1015:
                    console.log("TLS handshake failure");
                    break;
                default:
                    console.log(`Unknown close code: ${event.code}`);
            } 

            if(!this.reconnectInterval){
                this.reconnectInterval = setInterval(()=>{
                    if(!this.isConnected) this.connect()
                }, 5000)
            }
        }

        this.socket.onerror = (error) =>{
            console.log(`WebSocket Error: ${error}`)
        }

        this.socket.onmessage = (event) =>{
            const message = JSON.parse(event.data)
            this.handleMessage(message)
        }
    }

    handleMessage(message) {
        // console.log(`WebSocket Message Received: `, message)

        this.events.emit('message', message)

        if(message && message.p){
            this.events.emit(`message: ${message.p}, ${message.d}`)
        }

        // HANDLE LOGIC FOR TYPES OF MESSAGES AND WHAT TO DO WITH THEM
        switch(message.p){
            case 'init_packet':
                this.map = message.d.map
                console.log("MAP CHANGED"+this.map)
                break
            case 'self':
                this.events.emit('playerDataReceived', message.d)
                break
            case 'player':
                this.events.emit('playerJoined', message.d)
                console.log("Player Joined", message.d)
                break
            case 'position':
                this.events.emit('playerMoved', message.d)
                // console.log('Player Moved: ', message.d)
                break
            case 'disconnect':
                this.events.emit('playerLeft', message.d)
                break
        }

    }

    sendPlayerData(playerData) {

        if(!this.isConnected){
            console.warn("Cannot send player data: WebSocket not connected");
            return false;
        }

        try {
            const message = JSON.stringify({
                p: "position",
                d: [playerData.position.x, playerData.position.y, playerData.position.direction, playerData.position.map]
            })
            console.log("Message Sent to Server: ", message)
            this.socket.send(message)

            
            return true
        } catch (error) {
            console.error("Error sending player data:", error)
            return false
        }
    }

}

const networkService = new NetworkService()
export default networkService