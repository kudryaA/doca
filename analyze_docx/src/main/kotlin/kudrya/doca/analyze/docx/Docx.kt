package kudrya.doca.analyze.docx

import org.apache.poi.xwpf.usermodel.XWPFDocument
import java.io.InputStream
import java.util.*

class Docx(inputStream: InputStream) {
    val images: List<String>
    val texts: List<String>

    init {
        val document = XWPFDocument(inputStream)
        images =  document.allPictures.map {
            String(Base64.getEncoder().encode(it.data))
        }
        texts = document.paragraphs.map {
            it.text
        }
    }
}