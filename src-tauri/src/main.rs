// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri::{App, Manager};

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[cfg(target_os = "macos")]
use window_vibrancy::{apply_vibrancy, NSVisualEffectMaterial};

#[cfg(target_os = "windows")]
use window_vibrancy::apply_blur;

fn init(app: &mut App) -> std::result::Result<(), Box<dyn std::error::Error>> {
    let win = app.get_window("main").unwrap();

    #[cfg(target_os = "macos")]
    apply_vibrancy(&win, NSVisualEffectMaterial::HudWindow, None, None)
        .expect("Unsupported platform! 'apply_vibrancy' is only supported on macOS");

    #[cfg(target_os = "windows")]
    apply_blur(&win, Some((18, 18, 18, 18)))
        .expect("Unsupported platform! 'apply_blur' is only supported on Windows");

    // we perform the initialization code on a new task so the app doesn't freeze
    tauri::async_runtime::spawn(async move {
        std::thread::sleep(std::time::Duration::from_secs(1));
        win.show().unwrap();
    });

    Ok(())
}

fn main() {
    tauri::Builder::default()
        .setup(init)
        .invoke_handler(tauri::generate_handler![greet])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
