package kudrya.doca.analyze.docx

import com.google.gson.GsonBuilder
import com.rabbitmq.client.ConnectionFactory
import io.javalin.Javalin


fun main() {
    val factory = ConnectionFactory()
    val gson = GsonBuilder()
            .excludeFieldsWithoutExposeAnnotation()
            .create()
    factory.host = "rabbitmq"
    val app: Javalin = Javalin.create().start(7001)
    app.post("/analyze") {
        val file = it.uploadedFile("value")
        val id = it.queryParam("id")
        val docx = Docx(id!!, file!!.content)
        docx.texts.forEach { text ->
            SendToAnalyze("http://analyze_text:1491/analyze", id, text).send()
        }
        docx.images.forEach { image ->
            SendToAnalyze("http://analyze_image:1490/analyze", id, image).send()
        }

        factory.newConnection().use { connection -> connection.createChannel().use { channel ->
            channel.queueDeclare("analyze_docx_result", true, false, false, null)
            val text = gson.toJson(docx)
            channel.basicPublish("", "analyze_docx_result", null, gson.toJson(docx).toByteArray());
        } }
        it.result("{ \"status\": true }")
    }


}