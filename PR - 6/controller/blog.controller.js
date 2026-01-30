const BlogModel = require('../model/blog.model');
const path = require("path");
const fs = require('fs')

exports.addBlogPage = async (req, res) => {
    try {
        return res.render("blog/addBlog")
    } catch (error) {
        console.log(error);
        return res.redirect("/dashboard");
    }
}

exports.viewBlog = async (req, res) => {
    try {
        let blogs = await BlogModel.find();
        return res.render("blog/viewBlog", { blogs })
    } catch (error) {
        console.log(error);
        return res.redirect("/dashboard");
    }
}

exports.editBlogPage = async (req, res) => {
    try {
        let blog = await BlogModel.findById(req.params.id);
        return res.render("blog/editBlog", { blog })
    } catch (error) {
        console.log(error);
        return res.redirect("/dashboard");
    }
}

exports.singleView = async (req, res) => {
    try {
        let blog = await BlogModel.findById(req.params.id);
        return res.render("blog/singleView", { blog })
    } catch (error) {
        console.log(error);
        return res.redirect("/dashboard");
    }
}

exports.deleteBlog = async (req, res) => {
  try {
    let blog = await BlogModel.findById(req.params.id);

    if (!blog) {
      return res.redirect("/blog/view-blog");
    }

    if (blog.blogimage) {
      let blogImgPath = path.join(__dirname, "..", blog.blogimage);
      try {
        fs.unlinkSync(blogImgPath);
      } catch (error) {
        console.log("Blog image not found");
      }
    }

    if (blog.authorImage) {
      let authorImgPath = path.join(__dirname, "..", blog.authorImage);
      try {
        fs.unlinkSync(authorImgPath);
      } catch (error) {
        console.log("Author image not found");
      }
    }

    await BlogModel.findByIdAndDelete(req.params.id);

    return res.redirect("/blog/view-blog");
  } catch (error) {
    console.log(error);
    return res.redirect("/dashboard");
  }
};


exports.addblog = async (req, res) => {
    try {
        let blogImagePath = "";
        let authorImagePath = "";

        if (req.files && req.files.blogimage) {
            blogImagePath = "/uploads/" + req.files.blogimage[0].filename;
        }

        if (req.files && req.files.authorImage) {
            authorImagePath = "/uploads/" + req.files.authorImage[0].filename;
        }


        let newBlog = await BlogModel.create({
            ...req.body,
            blogimage: blogImagePath,
            authorImage: authorImagePath
        });
        return res.redirect("/blog/add-blog")
    } catch (error) {
        console.log(error);
        return res.redirect("/dashboard");
    }
}

exports.updateBlog = async (req, res) => {
  try {
    let blog = await BlogModel.findById(req.params.id);
    if (!blog) {
      return res.redirect("/dashboard");
    }

    let blogImagePath = blog.blogimage;
    let authorImagePath = blog.authorImage;

    if (req.files && req.files.length > 0) {
      req.files.forEach(file => {
        if (file.fieldname === "blogimage") {
          if (blog.blogimage) {
            try {
              fs.unlinkSync(path.join(__dirname, "..", blog.blogimage));
            } catch (e) {}
          }
          blogImagePath = "/uploads/" + file.filename;
        }

        if (file.fieldname === "authorImage") {
          if (blog.authorImage) {
            try {
              fs.unlinkSync(path.join(__dirname, "..", blog.authorImage));
            } catch (e) {}
          }
          authorImagePath = "/uploads/" + file.filename;
        }
      });
    }

    await BlogModel.findByIdAndUpdate(req.params.id, {
      ...req.body,
      blogimage: blogImagePath,
      authorImage: authorImagePath
    });

    return res.redirect("/blog/view-blog");
  } catch (error) {
    console.log(error);
    return res.redirect("/dashboard");
  }
};
