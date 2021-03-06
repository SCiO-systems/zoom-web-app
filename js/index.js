
(function () {

let DOMAIN=window.location.hostname

    var testTool = window.testTool;
  if (testTool.isMobileDevice()) {
    vConsole = new VConsole();
  }

  // it's option if you want to change the WebSDK dependency link resources. setZoomJSLib must be run at first
  // if (!china) ZoomMtg.setZoomJSLib('https://source.zoom.us/1.8.0/lib', '/av'); // CDN version default
  // else ZoomMtg.setZoomJSLib('https://jssdk.zoomus.cn/1.8.0/lib', '/av'); // china cdn option
  // ZoomMtg.setZoomJSLib('http://localhost:9999/node_modules/@zoomus/websdk/dist/lib', '/av'); // Local version default, Angular Project change to use cdn version
  ZoomMtg.preLoadWasm(); // pre download wasm file to save time.

  var API_KEY = "xxxx";

  /**
   * NEVER PUT YOUR ACTUAL API SECRET IN CLIENT SIDE CODE, THIS IS JUST FOR QUICK PROTOTYPING
   * The below generateSignature should be done server side as not to expose your api secret in public
   * You can find an eaxmple in here: https://marketplace.zoom.us/docs/sdk/native-sdks/web/essential/signature
   */
  var API_SECRET = "dummy";

  // some help code, remember mn, pwd, lang to cookie, and autofill.
  document.getElementById("display_name").value =
    "CDN" +
    ZoomMtg.getJSSDKVersion()[0] +
    testTool.detectOS() +
    "#" +
    testTool.getBrowserInfo();
  document.getElementById("meeting_number").value = testTool.getCookie(
    "meeting_number"
  );
  document.getElementById("meeting_pwd").value = testTool.getCookie(
    "meeting_pwd"
  );
  if (testTool.getCookie("meeting_lang"))
    document.getElementById("meeting_lang").value = testTool.getCookie(
      "meeting_lang"
    );

  document
    .getElementById("meeting_lang")
    .addEventListener("change", function (e) {
      testTool.setCookie(
        "meeting_lang",
        document.getElementById("meeting_lang").value
      );
      testTool.setCookie(
        "_zm_lang",
        document.getElementById("meeting_lang").value
      );
    });
  // copy zoom invite link to mn, autofill mn and pwd.
  document
    .getElementById("meeting_number")
    .addEventListener("input", function (e) {
      var tmpMn = e.target.value.replace(/([^0-9])+/i, "");
      if (tmpMn.match(/([0-9]{9,11})/)) {
        tmpMn = tmpMn.match(/([0-9]{9,11})/)[1];
      }
      var tmpPwd = e.target.value.match(/pwd=([\d,\w]+)/);
      if (tmpPwd) {
        document.getElementById("meeting_pwd").value = tmpPwd[1];
        testTool.setCookie("meeting_pwd", tmpPwd[1]);
      }
      document.getElementById("meeting_number").value = tmpMn;
      testTool.setCookie(
        "meeting_number",
        document.getElementById("meeting_number").value
      );
    });

  document.getElementById("clear_all").addEventListener("click", function (e) {
    testTool.deleteAllCookies();
    document.getElementById("display_name").value = "";
    document.getElementById("meeting_number").value = "";
    document.getElementById("meeting_pwd").value = "";
    document.getElementById("meeting_lang").value = "en-US";
    document.getElementById("meeting_role").value = 0;
    window.location.href = "/index.html";
  });

  // click join meeting button
  document
    .getElementById("sendInvite")
    .addEventListener("click", function (e) {
      e.preventDefault();
      var meetingConfig = testTool.getMeetingConfigHost();
      if (!meetingConfig.mn || !meetingConfig.name) {
        alert("Meeting number or username is empty");
        return false;
      }


      testTool.setCookie("meeting_number", meetingConfig.mn);
      testTool.setCookie("meeting_pwd", meetingConfig.pwd);

      console.log("meeting_number: "+ meetingConfig.mn)
        console.log("meeting_pwd: "+ meetingConfig.pwd);


        var selectedRow = JSON.parse(localStorage.getItem("selectedRow"));
        selectedRow.participants = []
        console.log(selectedRow)

        for (let i = 1; i < document.getElementsByClassName("participants").length + 1; i++) {

            try {

                let nameParticipant = document.getElementById("nameParticipant[" + i + "]").value
                let emailParticipant = document.getElementById("emailParticipant[" + i + "]").value
                console.log(nameParticipant)

                selectedRow.participants.push({
                    "name": nameParticipant,
                    "email": emailParticipant
                });
            } catch (e) {

            }

        }


        let createMeetinghostEmail  = "test@scio.systems"
        let createMeetingTitle  = selectedRow.title
        let createMeetingDate  = selectedRow.time.date
        let createMeetingDuration  = selectedRow.time.duration
        let createMeetingTimezone  = selectedRow.time.timezone
        let recordId  =selectedRow._id
        selectedRow.meetingNumber = meetingConfig.mn
        selectedRow.role = "1"
        selectedRow.pwd = meetingConfig.pwd
        selectedRow.join_url = localStorage.getItem("join_url")
        selectedRow.start_url = localStorage.getItem("start_url")


        // console.log(selectedRow)

      var signature = ZoomMtg.generateSignature({
        meetingNumber: meetingConfig.mn,
        apiKey: API_KEY,
        apiSecret: API_SECRET,
        role: meetingConfig.role,
        success: function (res) {

            var settings = {
                "url": "https://"+DOMAIN+":4000",
                "method": "POST",
                "timeout": 0,
                "headers": {
                    "Content-Type": "application/json"
                },
                "data": JSON.stringify(selectedRow),
            };

            $.ajax(settings).done(function (response) {

                // console.log("XXXXXXXXXX")
                // console.log(response.success)


                if(response.success === "ok"){


                    var selectedRow = JSON.parse(localStorage.getItem("selectedRow"));



                    let createMeetinghostEmail  = "test@scio.systems"
                    let createMeetingTitle  = selectedRow.title
                    let createMeetingDate  = selectedRow.time.date
                    let createMeetingDuration  = selectedRow.time.duration
                    let createMeetingTimezone  = selectedRow.time.timezone
                    let recordId  =selectedRow._id




                    //****Delete and add to history MEETING***//////
                    var settings = {
                        "url": "https://localhost:4000/requestedMeetingsRemove",
                        "method": "POST",
                        "timeout": 0,
                        "headers": {
                            "Content-Type": "application/json"
                        },
                        "data": JSON.stringify({"id":recordId}),
                    };

                    $.ajax(settings).done(function (response) {
                        console.log(response);
                    });


                    var settings = {
                        "url": "https://localhost:4000/addToHistory",
                        "method": "POST",
                        "timeout": 0,
                        "headers": {
                            "Content-Type": "application/json"
                        },
                        "data": JSON.stringify(selectedRow),
                    };

                    $.ajax(settings).done(function (response) {
                        console.log("resp"+response)

                    });





                    $("#infoModal").modal('show')
                    $("#infoModal").on('hide.bs.modal', function(){
                        window.location.reload();
                    });

                }else{
                    $("#errorModal").modal('show')

                }




                // meetingConfig.signature = response.signature;
                // meetingConfig.apiKey = API_KEY;
                // var joinUrl = "/meeting.html?" + testTool.serialize(meetingConfig);
                // // window.open(joinUrl, "_blank");


            });








        },
      });
    });

  // click copy jon link button
  window.copyJoinLink = function (element) {
      let participantNumber = element[element.length -2];

      var meetingConfig = testTool.getMeetingConfig(participantNumber);
    if (!meetingConfig.mn || !meetingConfig.name) {
      alert("Meeting number or username is empty");
      return false;
    }


    let joinUrl =""
    var signature = ZoomMtg.generateSignature({

      meetingNumber: meetingConfig.mn,
      apiKey: API_KEY,
      apiSecret: API_SECRET,
      role: meetingConfig.role,

      success: function (res) {

          var settings = {
              "url": "https://"+DOMAIN+":4000",
              "method": "POST",
              "timeout": 0,
              "headers": {
                  "Content-Type": "application/json"
              },
              "data": JSON.stringify({"meetingNumber":""+meetingConfig.mn+"","role":"0"}),
          };

          $.ajax(settings).done(function (response) {
              meetingConfig.signature = response.signature;
              meetingConfig.apiKey = API_KEY;

              console.log(res.result)

              joinUrl =
                  testTool.getCurrentDomain() +
                  "/meeting.html?" +
                  testTool.serialize(meetingConfig);
              $(element).attr("link", joinUrl);

              const el = document.createElement('textarea');
              el.value = joinUrl;
              document.body.appendChild(el);
              el.select();
              document.execCommand('copy');
              document.body.removeChild(el);

              document.getElementById("joinLinkTextBox["+participantNumber+"]").value =joinUrl


          });




      },
    });

    console.log("Join Url = "+joinUrl)

    // document.getElementById("joinLinkTextRow["+participantNumber+"]").style.display = "block"
      document.getElementById("joinLinkTextRow["+participantNumber+"]").classList.add("d-flex")

    document.getElementById("joinLinkTextBox["+participantNumber+"]").value =joinUrl

  };

    window.joinLinkForEmail = function (participantNumber) {

        var meetingConfig = testTool.getMeetingConfig(participantNumber);
        if (!meetingConfig.mn || !meetingConfig.name) {
            alert("Meeting number or username is empty");
            return false;
        }
        let joinUrl =""
        var signature = ZoomMtg.generateSignature({
            meetingNumber: meetingConfig.mn,
            apiKey: API_KEY,
            apiSecret: API_SECRET,
            role: meetingConfig.role,
            success: function (res) {


                var settings = {
                    "url": "https://"+DOMAIN+":4000",
                    "method": "POST",
                    "timeout": 0,
                    "headers": {
                        "Content-Type": "application/json"
                    },
                    "data": JSON.stringify({"meetingNumber":""+meetingConfig.mn+"","role":"0"}),
                };

                $.ajax(settings).done(function (response) {
                    meetingConfig.signature = response.signature;
                    meetingConfig.apiKey = API_KEY;

                    joinUrl =
                        testTool.getCurrentDomain() +
                        "/meeting.html?" +
                        testTool.serialize(meetingConfig);



                    var link = "mailto:" + encodeURIComponent(document.getElementById("emailParticipant[" + participantNumber + "]").value) + "?"
                        + "&subject=" + encodeURIComponent(document.getElementById("EmailSubject").value)
                        + "&body=" + encodeURIComponent(document.getElementById('EmailTextBox').value) +
                        "%0D%0A Zoom Meeting Join Link:\n\n %0D%0A" +
                        "\n" +
                        "\n" +
                        encodeURIComponent(joinUrl)
                    ;

                    window.location.href = link;


                });







            },
        });

        return joinUrl;

    };

})();
