class Review {
    constructor(review_id, reviewer_id, reviewed_id, rating, comment, created_at, incident_reported, feedback_type) {
      this.review_id = review_id;
      this.reviewer_id = reviewer_id;
      this.reviewed_id = reviewed_id;
      this.rating = rating;
      this.comment = comment;
      this.created_at = created_at;
      this.incident_reported = incident_reported;
      this.feedback_type = feedback_type;
    }

  }
  

  module.exports = Review;