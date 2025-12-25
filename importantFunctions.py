import pandas as pd

def remove_outliers(data):
    df_out = pd.DataFrame()
    for key,person_data in data.groupby("subject"):
        person_std = person_data.std(numeric_only=True)
        person_mean = person_data.mean(numeric_only=True)
        numeric_data = person_data.select_dtypes(include="number")

        is_high = numeric_data>(person_mean+2.3*person_std)
        is_low = numeric_data<(person_mean-2.3*person_std)

        outliers = is_high | is_low

        outliers_df = numeric_data[outliers.any(axis=1)]
        clean_df = person_data[~outliers.any(axis=1)]
        df_out = pd.concat([df_out,clean_df],ignore_index=True)
    return df_out