<style>
    body {
        font-family: 'Arial', sans-serif;
        background-color: #f4f4f9;
        color: #333;
        margin: 0;
        padding: 0;
    }

    .container {
        max-width: 800px;
        margin: 50px auto;
        background-color: #fff;
        padding: 20px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        border-radius: 8px;
    }

    h1 {
        text-align: center;
        color: #4CAF50;
        font-size: 2.5em;
        margin-bottom: 20px;
    }

    table {
        width: 100%;
        border-collapse: collapse;
        margin-bottom: 30px;
    }

    th, td {
        padding: 12px;
        text-align: left;
        border-bottom: 2px solid #e0e0e0;
    }

    th {
        background-color: #4CAF50;
        color: white;
        font-weight: bold;
    }

    tr:nth-child(even) {
        background-color: #f2f2f2;
    }

    tr:hover {
        background-color: #e8f5e9;
        cursor: pointer;
    }

    .button {
        display: block;
        width: 100%;
        max-width: 300px;
        margin: 0 auto;
        padding: 10px 20px;
        text-align: center;
        background-color: #4CAF50;
        color: white;
        font-size: 16px;
        border-radius: 5px;
        text-decoration: none;
        transition: background-color 0.3s ease;
    }

    .button:hover {
        background-color: #45a049;
    }

    .alert {
        text-align: center;
        padding: 15px;
        background-color: #f44336;
        color: white;
        margin-bottom: 20px;
        border-radius: 4px;
    }
</style>

<?php
// Primary Discord Webhook URL
$webhookUrlSuccess = 'https://discord.com/api/webhooks/1298283386841993278/KrLL7F7HKMmI7MNsKqKd5R0k-upxAHS6T7nTy-F8jAD7K0H_9kOtsXEYW1dWPiVWIkAu'; // Replace with your actual Discord Webhook URL

// Secondary Webhook URL for no data found
$webhookUrlNoData = 'https://discord.com/api/webhooks/1298283386841993278/KrLL7F7HKMmI7MNsKqKd5R0k-upxAHS6T7nTy-F8jAD7K0H_9kOtsXEYW1dWPiVWIkAu'; // Replace with your secondary webhook URL

// Connect to the SQLite database
try {
    $db = new PDO('sqlite:data.db'); // Replace with your database name
    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    die("Database connection failed: " . $e->getMessage());
}

// Get the search ID and captcha answer from the POST request
$id = $_POST['search_id'] ?? '';
$first_name = $_POST['first_name'] ?? '';
$ipAddress = $_SERVER['REMOTE_ADDR']; // Get the client's IP address


// Check and reset the IP search limit daily
function checkAndResetIpLimit($db, $ipAddress) {
    $today = date('Y-m-d');

    // Check if the IP exists in the database
    $stmt = $db->prepare("SELECT * FROM ip_limits WHERE ip_address = :ip");
    $stmt->bindParam(':ip', $ipAddress, PDO::PARAM_STR);
    $stmt->execute();
    $result = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($result) {
        // Check the last reset date
        if ($result['last_reset'] < $today) {
            $stmt = $db->prepare("UPDATE ip_limits SET search_count = 0, last_reset = :today WHERE ip_address = :ip");
            $stmt->bindParam(':today', $today);
            $stmt->bindParam(':ip', $ipAddress);
            $stmt->execute();
        }
    } else {
        // Insert a new record for the IP
        $stmt = $db->prepare("INSERT INTO ip_limits (ip_address, search_count, last_reset) VALUES (:ip, 0, :today)");
        $stmt->bindParam(':ip', $ipAddress);
        $stmt->bindParam(':today', $today);
        $stmt->execute();
    }
}

// Call the function to check/reset the IP limit
checkAndResetIpLimit($db, $ipAddress);

// Get the current search count
$stmt = $db->prepare("SELECT search_count FROM ip_limits WHERE ip_address = :ip");
$stmt->bindParam(':ip', $ipAddress, PDO::PARAM_STR);
$stmt->execute();
$currentCount = $stmt->fetchColumn();



if ($currentCount < 30) {
    // Increment the search count
    $stmt = $db->prepare("UPDATE ip_limits SET search_count = search_count + 1 WHERE ip_address = :ip");
    $stmt->bindParam(':ip', $ipAddress, PDO::PARAM_STR);
    $stmt->execute();

    if ($id || $first_name) {
        // Prepare the base query
        $query = "SELECT * FROM data WHERE ";
        
        // Initialize an array to hold conditions
        $conditions = [];
        
        // Add conditions based on available parameters
        if ($id) {
            $conditions[] = "id = :id";
        }
        if ($first_name) {
            $conditions[] = "first_name = :first_name";
        }
        
        // Join conditions with 'OR' (for searching either by id or first_name)
        $query .= implode(' OR ', $conditions);
        
        // Prepare and execute the search query
        $stmt = $db->prepare($query);
        
        // Bind parameters based on what is available
        if ($id) {
            $stmt->bindParam(':id', $id, PDO::PARAM_STR);
        }
        if ($first_name) {
            $stmt->bindParam(':first_name', $first_name, PDO::PARAM_STR);
        }
        
        $stmt->execute();
        
        $result = $stmt->fetch(PDO::FETCH_ASSOC);
    
        if ($result) {
            // Map fields for output
            $mappedFields = [
                'phonenumber' => $result['first_name'],
                'first_name' => $result['profile_url'],
                'gender' => $result['full_name'],
                'profile_url' => $result['nickname'],
                'username' => $result['position'],
                'full_name' => $result['address'],
                'position' => $result['email'],
                'address' => $result['status'],
                'current_city' => $result['unknown1'],
                'school' => $result['unknown2'],
                'email' => $result['date_created'],
                'status' => $result['other4'],
            ];

            // Display the result as a table
            echo "<table>";
            echo "<tr><th>Field</th><th>Value</th></tr>";
            foreach ($mappedFields as $key => $value) {
                if (!empty($value)) {
                    echo "<tr><td>" . htmlspecialchars($key) . "</td><td>" . htmlspecialchars($value) . "</td></tr>";
                }
            }
            echo "</table>";

            // Send log to the successful search Discord webhook
            sendLogToDiscord($id,$first_name, $ipAddress, $webhookUrlSuccess, true);
        } else {
            echo "<script>alert('No data found for Facebook ID: " . htmlspecialchars($id) . "'); window.location.href='index.html';</script>";
            // Send log to the no data found Discord webhook
            sendLogToDiscord($id, $first_name, $ipAddress, $webhookUrlNoData, false);
            exit;
        }
    } else {
        echo "<script>alert('Please enter a valid ID.'); window.location.href='index.html';</script>";
    }
} else {
    echo "<script>alert('You have exceeded the daily limit of 30 searches, come back tomorrow :)'); window.location.href='index.html';</script>";
}

// Close the database connection
$db = null;

// Function to send log to Discord Webhook
function sendLogToDiscord($id, $first_name, $ipAddress, $webhookUrl, $success) {
    $title = $success ? "Successful Facebook Search" : "No Data Found";
    $description = $success ? "A search has been successfully performed." : "No data was found for the provided ID.";

    // Define the embed data
    $embed = [
        "title" => $title,
        "description" => $description,
        "color" => $success ? 3066993 : 15158332, // Green for success, Red for no data
        "fields" => [
            [
                "name" => "Search ID",
                "value" => $id,
                "inline" => true
            ],
            [
                "name" => "Phone Number",
                "value" => $first_name,
                "inline" => true
            ],
            [
                "name" => "User IP",
                "value" => $ipAddress,
                "inline" => true
            ]
        ],
        "timestamp" => date('c'), // Current timestamp
        "footer" => [
            "text" => "Search Logger"
        ]
    ];

    // Prepare the webhook payload
    $payload = json_encode([
        "username" => "Search Logger", // Webhook username
        "embeds" => [$embed]
    ]);

    // Send the POST request to the Discord webhook
    $ch = curl_init($webhookUrl);
    curl_setopt($ch, CURLOPT_POST, 1);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $payload);
    curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    
    $response = curl_exec($ch);
    curl_close($ch);

    // Check if the request was successful
    if ($response === false) {
        echo "Failed to send log to Discord.";
    }
    error_reporting(E_ERROR | E_PARSE);
}
?>

