package computerdatabase

import scala.concurrent.duration._

import io.gatling.core.Predef._  
import io.gatling.http.Predef._  
import io.gatling.jdbc.Predef._

class WebSocket extends Simulation {
val httpConf = http.baseURL("http://frima-server-1.herokuapp.com")
  .acceptHeader("text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8")
  .doNotTrackHeader("1")
  .acceptLanguageHeader("en-US,en;q=0.5")
  .acceptEncodingHeader("gzip, deflate")
  .userAgentHeader("Gatling2")
  .disableCaching
  .disableWarmUp
    .wsBaseURL("ws://frima-server-1.herokuapp.com")

  val scn = scenario("WebSocket")
    .exec(ws("Connect WS").open("/"))
	.during(300 seconds) {
		pace(100 milliseconds)
			.exec(ws("Attack boss").sendText("""{"token":"eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiI1NmRhNGIwM2QxZTVkMjAzMDA1OGRhY2YiLCJleHAiOjE0NTczNjg4NzI4NjJ9.Kx8EoBPceiMwRWltlu2nbl_WKYD21cjzf2YR7mJ1aRU","command":{"name":"attack","parameters":{"number":10}}}"""))
	}
    .exec(ws("Close WS").close)
    setUp(
    scn.inject(rampUsers(500) over(120 seconds)).protocols(httpConf)
  )
  
}
