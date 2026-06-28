from flask import Flask, render_template, request, redirect, url_for
import joblib
import numpy as np

app = Flask(__name__)

# ── Load model and scaler separately ───────────────────────
model  = joblib.load('floods.save')
scaler = joblib.load('transform.save')

FEATURES = ['Temp', 'Humidity', 'Cloud Cover', 'ANNUAL',
            'Jan-Feb', 'Mar-May', 'Jun-Sep', 'Oct-Dec', 'avgjune', 'sub']

print('✅ floods.save    loaded — XGBoost model')
print('✅ transform.save loaded — StandardScaler')
print(f'✅ Features expected: {FEATURES}')


# ── Route 1: Home Page ──────────────────────────────────────
@app.route('/')
def home():
    return render_template('home.html')


# ── Route 2: Prediction Input Form ─────────────────────────
@app.route('/Predict', methods=['GET', 'POST'])
def predict():
    if request.method == 'GET':
        return render_template('index.html', features=FEATURES)

    try:
        # Collect all feature values from form
        input_values = []
        for feat in FEATURES:
            val = request.form.get(feat, '').strip()
            if val == '':
                raise ValueError(f'Missing value for: {feat}')
            input_values.append(float(val))

        # Scale inputs using saved scaler
        input_array  = np.array([input_values])
        input_scaled = scaler.transform(input_array)

        # Predict using saved model
        prediction  = model.predict(input_scaled)[0]
        probability = round(
            model.predict_proba(input_scaled)[0][1] * 100, 1
        )

        # Build input summary for result page
        inputs_display = {
            feat: val
            for feat, val in zip(FEATURES, input_values)
        }

        # Redirect based on prediction
        if int(prediction) == 1:
            return render_template('chance.html',
                                   probability=probability,
                                   inputs=inputs_display)
        else:
            return render_template('no_chance.html',
                                   probability=probability,
                                   inputs=inputs_display)

    except Exception as e:
        return render_template('index.html',
                               features=FEATURES,
                               error=str(e))


# ── Route 3: Flood Detected Page ────────────────────────────
@app.route('/chance')
def chance():
    return render_template('chance.html',
                           probability='N/A', inputs={})


# ── Route 4: No Flood Page ───────────────────────────────────
@app.route('/no_chance')
def no_chance():
    return render_template('no_chance.html',
                           probability='N/A', inputs={})


# ── Run App ──────────────────────────────────────────────────
if __name__ == '__main__':
    app.run(debug=False)
