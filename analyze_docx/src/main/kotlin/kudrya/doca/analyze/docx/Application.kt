package kudrya.doca.analyze.docx

import io.javalin.Javalin


fun main() {
    val app: Javalin = Javalin.create().start(7001)
    app.post("/analyze") {
        val file = it.uploadedFile("value")
        val id = it.queryParam("id")
        val docx = Docx(file!!.content)
        docx.texts.forEach { text ->
            SendToAnalyze("http://analyze_text:1491/analyze", id!!, text).send()
        }
        docx.images.forEach { image ->
            SendToAnalyze("http://analyze_image:1490/analyze", id!!, image).send()
        }
    }


}