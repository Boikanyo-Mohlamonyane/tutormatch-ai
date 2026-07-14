from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics.pairwise import cosine_similarity

app = Flask(__name__)
CORS(app)


# ======================================================
# Sample Tutor Dataset
# Replace this with your database/API later
# ======================================================

tutors = [
    {
        "id": 1,
        "name": "Lethabo Mohlamonyane",
        "specialization": "MACHINE_LEARNING",
        "experience": 5,
        "rating": 4.8
    },
    {
        "id": 2,
        "name": "Gift Mokoena",
        "specialization": "JAVA",
        "experience": 4,
        "rating": 4.5
    },
    {
        "id": 3,
        "name": "Thabo Nkosi",
        "specialization": "DATABASE",
        "experience": 3,
        "rating": 4.2
    }
]


# ======================================================
# Convert tutor data into ML vectors
# ======================================================

specialization_encoder = LabelEncoder()

specialization_encoder.fit(
    [
        "MACHINE_LEARNING",
        "JAVA",
        "DATABASE"
    ]
)


def tutor_vector(tutor):

    specialization = specialization_encoder.transform(
        [tutor["specialization"]]
    )[0]

    return [
        specialization,
        tutor["experience"],
        tutor["rating"]
    ]


tutor_vectors = np.array(
    [
        tutor_vector(tutor)
        for tutor in tutors
    ]
)


# ======================================================
# Health Check
# ======================================================

@app.route("/", methods=["GET"])
def home():

    return jsonify({
        "service": "AI TutorMatch ML Service",
        "status": "running"
    })


# ======================================================
# Tutor Recommendation Endpoint
# Spring Boot calls this
# ======================================================

@app.route("/recommend", methods=["POST"])
def recommend():

    data = request.json


    student_skill = data.get(
        "skill",
        "JAVA"
    )

    student_experience = data.get(
        "experience",
        1
    )


    student_vector = np.array(
        [
            [
                specialization_encoder.transform(
                    [student_skill]
                )[0],
                student_experience,
                5
            ]
        ]
    )


    similarity = cosine_similarity(
        student_vector,
        tutor_vectors
    )


    scores = similarity[0]


    recommendations = []


    for index in scores.argsort()[::-1]:

        tutor = tutors[index]

        recommendations.append(
            {
                "tutorId": tutor["id"],
                "name": tutor["name"],
                "specialization": tutor["specialization"],
                "experience": tutor["experience"],
                "rating": tutor["rating"],
                "matchScore": round(
                    float(scores[index]) * 100,
                    2
                )
            }
        )


    return jsonify(
        recommendations
    )


# ======================================================
# Run Application
# ======================================================

if __name__ == "__main__":

    app.run(
        host="0.0.0.0",
        port=5000
    )