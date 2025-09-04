-- =================================================================
-- Users Table: 사용자 정보 저장
-- =================================================================
CREATE TABLE `Users` (
    `user_id` INT NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(255) NOT NULL,
    `password` VARCHAR(255) NOT NULL,
    `nickname` VARCHAR(50) NOT NULL,
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`user_id`),
    UNIQUE KEY `uk_email` (`email`),
    UNIQUE KEY `uk_nickname` (`nickname`)
) COMMENT='사용자 정보 테이블';


-- =================================================================
-- Playlists Table: 플레이리스트 메타 정보 저장
-- =================================================================
CREATE TABLE `Playlists` (
    `playlist_id` INT NOT NULL AUTO_INCREMENT,
    `user_id` INT NOT NULL COMMENT '소유자 ID (Users 테이블 참조)',
    `name` VARCHAR(100) NOT NULL,
    `description` TEXT NULL,
    `is_public` BOOLEAN NOT NULL DEFAULT TRUE COMMENT 'true: 공개, false: 비공개',
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`playlist_id`),
    FOREIGN KEY (`user_id`) REFERENCES `Users`(`user_id`) ON DELETE CASCADE
) COMMENT='플레이리스트 정보 테이블';


-- =================================================================
-- Songs Table: 곡 정보 저장소 (캐시 역할)
-- =================================================================
CREATE TABLE `Songs` (
    `song_id` INT NOT NULL AUTO_INCREMENT,
    --`youtube_video_id` VARCHAR(20) NOT NULL COMMENT '유튜브 영상 고유 ID',
    --title` VARCHAR(255) NOT NULL,
    `track_name` VARCHAR(255) NOT NULL COMMENT '곡명',
    `artist` VARCHAR(25) NOT NULL COMMENT '아티스트명', 
    `spotify_url` VARCHAR(255) NOT NULL COMMENT 'Spotify URL', 
    `album_image_url` VARCHAR(255) NOT NULL COMMENT 'Album Image URL', 
    PRIMARY KEY (`song_id`),
    UNIQUE KEY `spotify_url` (`spotify_url`)
) COMMENT='곡 정보 캐시 테이블';


-- =================================================================
-- Playlist_Songs Table: 플레이리스트와 곡의 관계 정의 (Junction Table)
-- =================================================================
CREATE TABLE `Playlist_Songs` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `playlist_id` INT NOT NULL COMMENT '플레이리스트 ID (Playlists 테이블 참조)',
    `song_id` INT NOT NULL COMMENT '곡 ID (Songs 테이블 참조)',
    `sequence` INT NOT NULL COMMENT '플레이리스트 내 곡의 순서',
    `added_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    FOREIGN KEY (`playlist_id`) REFERENCES `Playlists`(`playlist_id`) ON DELETE CASCADE,
    FOREIGN KEY (`song_id`) REFERENCES `Songs`(`song_id`) ON DELETE CASCADE,
    UNIQUE KEY `uk_playlist_song` (`playlist_id`, `song_id`) -- 한 플레이리스트에 동일한 곡이 중복 추가되는 것을 방지
) COMMENT='플레이리스트-곡 연결 테이블';