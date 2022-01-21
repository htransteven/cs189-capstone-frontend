const configureCloudwatch = require("../../../../api/configure_cloudwatch");
var cw = configureCloudwatch();

export default function handler(req, res) {
  const { appointmentId } = req.query;
  const table_name = "appointments";
  if (req.method === "GET") {
    const list = await new Promise((resolve, reject) => {
      const result = cw.startQuery({
              logGroupName: "brad_convos",
              queryString: `fields @timestamp, @message
        | sort @timestamp desc
        | filter slots.AppointmentNumber = ${appointment_id}
        | limit 10`,
              startTime: new Date("2021-09-12").getTime(),
              endTime: new Date().getTime(),
              limit: 10
            }, (err, data) => {
               const id = setInterval(() => {
                  cw.getQueryResults(data, (err, response) => {
                    if (err) {
                      reject(err)
                      return
                    }
                    if (response.status !== "Running") {
                      clearInterval(id)
            //These two aren't really necessary but it gives everything in the query/log if it's needed
            res.send(response)
                      console.log(response.results)
            
            //Give to Frontend:This console log gives the date/timestamp of the log (ex.2022-01-11 20:38:44.087)
            console.log((response.results[0][0]).value)
            
            const text =String((response.results[0][1]).value)
            const obj=JSON.parse((text))
  
            //Give to Frontend:This console log gives the user-input/message to the bot
            console.log(obj.inputTranscript)
  
            //Give to Frontend:This console log gives the bot-response
            console.log(obj.botResponse)
            
                      resolve(response.results)
            //console.log( (response.results[0][1]).value )
            //console.log(text)
                    }
                  })
               }, 10000)
              
            }
          )
      })
  
  }
}