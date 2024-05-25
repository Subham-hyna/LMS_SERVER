class ApiFeatures {
    constructor(query, queryStr) {
      this.query = query;
      this.queryStr = queryStr;
    }
  
    searchUser() {
      const keyword = this.queryStr.keyword
        ? {
            $or : [
                {email: {
                    $regex: this.queryStr.keyword,
                    $options: "i",
                }},
                {name: {
                    $regex: this.queryStr.keyword,
                    $options: "i",
                }},
                {registrationNo: {
                    $regex: this.queryStr.keyword,
                    $options: "i",
                }}
            ]
          }
        : {};
        this.query = this.query.find(keyword);
      return this;
    }

    searchBook() {
      const keyword = this.queryStr.keyword
        ? {
            $or : [
                {ISBN: {
                    $regex: this.queryStr.keyword,
                    $options: "i",
                }},
                {title: {
                    $regex: this.queryStr.keyword,
                    $options: "i",
                }},
                {author: {
                    $regex: this.queryStr.keyword,
                    $options: "i",
                }}
            ]
          }
        : {};
        this.query = this.query.find(keyword);
      return this;
    }
  
    filter() {
      const queryCopy = { ...this.queryStr };

      const removeFields = ["keyword", "page", "limit"];
  
      removeFields.forEach((key) => delete queryCopy[key]);

      this.query = this.query.find(queryCopy);
  
      return this;
    }
  
    pagination(resultPerPage) {
      const currentPage = Number(this.queryStr.page) || 1;
  
      const skip = resultPerPage * (currentPage - 1);
  
      this.query = this.query.limit(resultPerPage).skip(skip);
  
      return this;
    }  
}

export { ApiFeatures };
