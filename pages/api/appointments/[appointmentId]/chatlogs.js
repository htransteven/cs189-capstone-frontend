var parseJSON = require("date-fns/parseJSON");
var getUnixTime = require("date-fns/getUnixTime");

const configureCloudwatch = require("../../../../api-utils/configure_cloudwatch");
var cw = configureCloudwatch();

export default async function handler(req, res) {
  const { appointmentId } = req.query;
  const table_name = "appointments";
  if (req.method === "GET") {
    const list = await new Promise((resolve, reject) => {
      const result = cw.startQuery(
        {
          logGroupName: "brad_convos",
          queryString: `fields @timestamp, @message
                | sort @timestamp desc
                | filter slots.AppointmentNumber = ${appointmentId}
                | limit 10`,
          startTime: new Date("2021-09-12").getTime(),
          endTime: new Date().getTime(),
          limit: 10,
        },
        (err, data) => {
          const id = setInterval(() => {
            cw.getQueryResults(data, (err, response) => {
              if (err) {
                reject(err);
                return;
              }

              var ret_arr = [];
              if (response.status !== "Running") {
                clearInterval(id);

                let length = response.results.length;
                for (let i = length - 1; i >= 0; i--) {
                  //Give to Frontend:This console log gives the date/timestamp of the log (ex.2022-01-11 20:38:44.087)
                  console.log("Timestamp:");
                  var the_res = response.results[i][0].value;
                  the_res = the_res.replace(" ", "T");
                  console.log(getUnixTime(parseJSON(the_res)));

                  const text = String(response.results[i][1].value);
                  const obj = JSON.parse(text);

                  //Give to Frontend:This console log gives the user-input/message to the bot
                  console.log("User Input:");
                  console.log(obj.inputTranscript);

                  //Give to Frontend:This console log gives the user-input/message to the bot
                  console.log("Bot Response:");
                  console.log(obj.botResponse);

                  const ret = {
                    timestamp: getUnixTime(parseJSON(the_res)),
                    input: obj.inputTranscript,
                    response: obj.botResponse,
                  };
                  ret_arr.push(ret);
                }

                resolve(response.results);

                res.send(ret_arr);
              }
            });
          }, 10000);
        }
      );
    });
  } else {
    res.status(400).send({ message: `${req.method} is not a valid request` });
  }
}
