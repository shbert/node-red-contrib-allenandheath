module.exports = {
    object: function() { return {
        parameters: undefined,
        data: {},

        setup: function(parameters) {
            this.parameters = parameters;
        },

        reset: function() {
            data = {};
        },

        //Send out
        generatePacket: function generatePacket(msg, server, midiChannel, callback) {
            var temp = this;
            if(msg.payload.function == "remoteShutdown") {                                
                //Generate the packet!
                var retMsg = {
                    "payload": {
                        "function": "remoteShutdown"
                    }
                }
                
                try {
                    callback(retMsg);
                }
                catch(e) {}

                return Buffer.from([(0xB0 + parseInt(midiChannel, 16)), 0x63, 0x00, (0xB0 + parseInt(midiChannel, 16)), 0x62, 0x5F, (0xB0 + parseInt(midiChannel, 16)), 0x06, 0x00, (0xB0 + parseInt(midiChannel, 16)), 0x26, 0x00]);
            }


            return false;
        },

        //Recieved data
        recieve: function recieve(midiChannel, data, server, syncActive) {
            var object = this;

            var ret = false;
            for(var i = 0; i < data.length; i++) {
                if(data.slice(i + 0, i + 9).equals(object.parameters.sysexHeader.currentHeader) == true && data[i + 9] == 0x02) {
                    //Find the end of the packet
                    var end = i;
                    for(var j = i; j < data.length; j++) {if(data[j] == 0xF7){end = j; break;}}

                    ret = true;
                }
            }

            //If we found something and sync is not active send it out!
            if(syncActive == false && ret == true) {
                var msg = {
                    "payload": {
                        "function": "remoteShutdown"
                    }
                }
                
                Object.assign(msg.payload, object.data);

                return msg;
            }
            else if(ret == true){return true;}

            return false;
        },

        //Send the data
        getData() {
            var msg = {
                "payload": {
                    "function": "remoteShutdown"
                }
            }
            
            Object.assign(msg.payload, this.data);
            return msg;
        },

        //Ping
        sendPing: function sendPing(server, midiChannel, successFunction) {
            return false;
        }
    }}
}