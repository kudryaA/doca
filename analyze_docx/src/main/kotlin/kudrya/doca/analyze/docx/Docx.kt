package kudrya.doca.analyze.docx

import com.google.gson.annotations.Expose
import com.google.gson.annotations.SerializedName
import org.apache.poi.xwpf.usermodel.XWPFDocument
import java.io.InputStream
import java.util.*
import kotlin.collections.HashMap

class Docx(@Expose(serialize = true) val id: String, inputStream: InputStream) {
    @Expose(serialize = false)
    val images: List<String>

    @Expose(serialize = false)
    val texts: List<String>

    @Expose(serialize = true)
    val hyperlinks: List<Map<String, String>>

    @Expose(serialize = true)
    val comments: List<Map<String, String>>

    @Expose(serialize = true)
    @SerializedName(value = "has_tables")
    val hasTables: Boolean

    @Expose(serialize = true)
    @SerializedName(value = "has_charts")
    val hasCharts: Boolean

    @Expose(serialize = true)
    @SerializedName(value = "has_pictures")
    val hasPictures: Boolean

    @Expose(serialize = true)
    @SerializedName(value = "has_hyperlinks")
    val hasHyperlinks: Boolean

    @Expose(serialize = true)
    @SerializedName(value = "has_comments")
    val hasComments: Boolean

    @Expose(serialize = true)
    @SerializedName(value = "count_paragraph")
    val countParagraph: Int

    @Expose(serialize = true)
    @SerializedName(value = "count_tables")
    val countTables: Int

    @Expose(serialize = true)
    @SerializedName(value = "count_charts")
    val countCharts: Int

    @Expose(serialize = true)
    @SerializedName(value = "count_pictures")
    val countPictures: Int

    @Expose(serialize = true)
    @SerializedName(value = "count_hyperlinks")
    val countHyperlinks: Int

    @Expose(serialize = true)
    @SerializedName(value = "count_comments")
    val countComments: Int

    init {
        val document = XWPFDocument(inputStream)
        hasPictures = document.allPictures.size > 0
        countPictures = document.allPictures.size
        images =  document.allPictures.map {
            String(Base64.getEncoder().encode(it.data))
        }
        countParagraph = document.paragraphs.size
        texts = document.paragraphs.map {
            it.text
        }.filter {
            it.isNotEmpty()
        }
        hasHyperlinks = document.hyperlinks.isNotEmpty()
        countHyperlinks = document.hyperlinks.size
        hyperlinks = document.hyperlinks.map {
            val res = HashMap<String, String>()
            res["name"] = it.id
            res["url"] = it.url
            res
        }
        hasTables = document.tables.size > 0
        countTables = document.tables.size
        hasCharts = document.charts.size > 0
        countCharts = document.charts.size
        hasComments = document.comments.isNotEmpty()
        countComments = document.comments.size
        comments = document.comments.map {
            val res = HashMap<String, String>()
            res["author"] = it.author
            res["comment"] = it.text
            res
        }
    }
}