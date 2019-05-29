DROP TABLE food;

CREATE TABLE IF NOT EXISTS food (
    item VARCHAR(255),
    description VARCHAR(500),
    food_id VARCHAR(255)
    );

    INSERT INTO food (item, description)

    VALUES (
        'Eggs',
        'Per 100g - Calories: 147kcal | Fat: 9.94g | Carbs: 0.77g | Protein: 12.58g'
    )