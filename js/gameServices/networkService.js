class NetworkService {
    constructor() {
        this.socket = null,
        this.isConnected = false,
        this.reconnectInterval = null,
        this.serverURL = 'wss://pine.candl.pro/ws/testsocket:443'
    }

    connect() {
        this.socket = new WebSocket(this.serverURL)

        this.socket.onopen = () =>{
            console.log("WebSocket Connection Successful")
            this.isConnected = true,
            clearInterval(this.reconnectInterval)
        }

        this.socket.onclose = () =>{
            console.log('WebSocket connection closed');
            this.isConnected = false

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
        console.log(`WebSocket Message Received: `, message)

        // HANDLE LOGIC FOR TYPES OF MESSAGES AND WHAT TO DO WITH THEM
        
    }

}

const networkService = new NetworkService()
export default networkService