2019 NeurIPS Submission
Title: Time-series Generative Adversarial Networks
Authors: Jinsung Yoon, Daniel Jarrett, Mihaela van der Schaar

Last Updated Date: May 29th 2019
Code Author: Jinsung Yoon (jsyoon0823@gmail.com)

1. Datasets (in Data Folder)
(1) CASAS Aruba dataset
- CASAS_aruba_data.csv


2. Codes
(1) data_loading.py
- Transform raw time-series data to preprocessed time-series data 

(2) Metrics Folder
  (a) visualization_metrics.py
  - PCA and t-SNE analysis between Original data and Synthetic data
  (b) discriminative_score_metrics.py
  - Use Post-hoc RNN to classify Original data and Synthetic data
  (c) predictive_score_metrics.py
  - Use Post-hoc RNN to predict one-step ahead (last feature)

(2) tganWithCheckpointing.py
- Use original time-series data as training set to generater synthetic time-series data

(3) tutorial_timegan.ipynb
- Guides through the code for setting the parameters
- Replicate the performance
- Report discriminative and predictive scores and t-SNE and PCA analysis

(4) main.py
- Replicate the performance
- Report discriminative and predictive scores and t-SNE and PCA analysis

3. How to use?
Run tutorial_timegan.ipynb 
OR
Run main.py 
