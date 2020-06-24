local client = require "resty.websocket.client"

local ws, err = client:new()

local url = "ws://gw.me/xiaoxing/ws/xiaoxing/patient/203809106?sessionType=0&channelType=3&loginId=203809106&token=200618172b711ca1660506694ea685414fa32f4432d06d06"

local ok, err = ws:connect(url)

if not ok then
    ngx.say("Failed to connect: ", err)
    return
end

local data, typ, err = ws:recv_frame()
if not data then
    ngx.say("Failed to receive the frame: ", err)
    return
end

ngx.say("received: ", data, "(", typ, "): ", err)
