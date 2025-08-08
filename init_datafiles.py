#!/usr/bin/env python3
"""
GameRanking Data Initialization Script
Initialisiert die benötigten YAML-Dateien aus den Templates, falls sie nicht existieren.
"""

import shutil
from pathlib import Path

def init_data_files():
    """
    Initialisiert games_list.yaml und rankings.yaml aus den Templates,
    falls sie nicht existieren.
    """
    data_dir = Path(__file__).parent / "data"
    
    files_to_create = [
        ("games_list.yaml.template", "games_list.yaml"),
        ("rankings.yaml.template", "rankings.yaml")
    ]
    
    for template_file, target_file in files_to_create:
        template_path = data_dir / template_file
        target_path = data_dir / target_file
        
        if not target_path.exists():
            if template_path.exists():
                shutil.copy2(template_path, target_path)
                print(f"✅ Created {target_file} from template")
            else:
                print(f"❌ Template {template_file} not found!")
        else:
            print(f"ℹ️  {target_file} already exists, skipping...")

if __name__ == "__main__":
    print("🚀 GameRanking Data Initialization")
    print("=" * 40)
    init_data_files()
    print("=" * 40)
    print("✅ Data initialization complete!")
