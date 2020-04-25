package kudrya.doca.analyze.docx

import com.google.gson.Gson
import com.squareup.okhttp.MediaType
import com.squareup.okhttp.OkHttpClient
import com.squareup.okhttp.Request
import com.squareup.okhttp.RequestBody
import java.io.IOException


class SendToAnalyze(private val component: String, private val id: String,
                        private val value: String) {
    companion object {
        private val httpClient = OkHttpClient()
        private val gson = Gson()

        private class Body(val id: String, val value: String)
    }

    fun send() {
        val body: RequestBody = RequestBody.create(
            MediaType.parse("application/json; charset=utf-8"),
            gson.toJson(Body(id, value))
        )
        val request: Request = Request.Builder()
            .url(component)
            .addHeader("User-Agent", "OkHttp Bot")
            .post(body)
            .build()

        try {
            httpClient.newCall(request).execute()
        } catch (e: Exception) {
          println(e)
        }

    }
}